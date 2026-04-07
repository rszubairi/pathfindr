"use node";

import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import { Id } from './_generated/dataModel';
import { getAppUrl as getBaseAppUrl } from './utils';

// ─── Types ──────────────────────────────────────────────────

interface XenditInvoice {
  id: string;
  external_id: string;
  status: 'PENDING' | 'PAID' | 'SETTLED' | 'EXPIRED';
  invoice_url: string;
  amount: number;
  currency: string;
  payer_email?: string;
  metadata?: Record<string, string>;
  expiry_date?: string;
}

// ─── Helpers ────────────────────────────────────────────────

function getAppUrl(): string {
  return getBaseAppUrl();
}

function getXenditSecretKey(): string {
  return process.env.XENDIT_SECRET_KEY!;
}

function xenditAuthHeader(): string {
  return 'Basic ' + Buffer.from(getXenditSecretKey() + ':').toString('base64');
}

function generateDonationCouponCode(companyName: string): string {
  const prefix = companyName
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 3)
    .toUpperCase() || 'PFD';
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${year}-${random}`;
}

// MYR pricing for tiers (annual)
function getTierConfig(tier: 'pro' | 'expert') {
  return {
    pro: { amountMyr: 45, applicationsLimit: 5, name: 'Pro Annual Subscription' },
    expert: { amountMyr: 225, applicationsLimit: 20, name: 'Expert Annual Subscription' },
  }[tier];
}

async function createXenditInvoice(params: {
  externalId: string;
  amount: number;
  currency: string;
  description: string;
  payerEmail: string;
  payerName: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
  metadata: Record<string, string>;
  invoiceDuration?: number; // seconds, default 24h
}): Promise<XenditInvoice> {
  const response = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      Authorization: xenditAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      external_id: params.externalId,
      amount: params.amount,
      currency: params.currency,
      description: params.description,
      payer_email: params.payerEmail,
      customer: {
        given_names: params.payerName,
        email: params.payerEmail,
      },
      success_redirect_url: params.successRedirectUrl,
      failure_redirect_url: params.failureRedirectUrl,
      metadata: params.metadata,
      invoice_duration: params.invoiceDuration ?? 86400, // 24 hours default
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Xendit invoice creation failed: ${error}`);
  }

  return response.json() as Promise<XenditInvoice>;
}

async function getXenditInvoice(invoiceId: string): Promise<XenditInvoice> {
  const response = await fetch(`https://api.xendit.co/v2/invoices/${invoiceId}`, {
    headers: { Authorization: xenditAuthHeader() },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve Xendit invoice: ${invoiceId}`);
  }

  return response.json() as Promise<XenditInvoice>;
}

// ─── Create Checkout Session (Subscription) ─────────────────

export const createCheckoutSession = action({
  args: {
    userId: v.id('users'),
    tier: v.union(v.literal('pro'), v.literal('expert')),
  },
  handler: async (ctx, args): Promise<{ sessionUrl: string }> => {
    const appUrl = getAppUrl();
    const config = getTierConfig(args.tier);

    const user = await ctx.runQuery(api.auth.getCurrentUser, { userId: args.userId });
    if (!user) throw new Error('User not found');

    const externalId = `sub-${args.userId}-${args.tier}-${Date.now()}`;

    const invoice = await createXenditInvoice({
      externalId,
      amount: config.amountMyr,
      currency: 'MYR',
      description: config.name,
      payerEmail: user.email,
      payerName: user.fullName ?? user.email,
      successRedirectUrl: `${appUrl}/subscription/success?external_id=${encodeURIComponent(externalId)}`,
      failureRedirectUrl: `${appUrl}/pricing`,
      metadata: {
        userId: args.userId,
        tier: args.tier,
        paymentType: 'subscription',
        externalId,
      },
    });

    return { sessionUrl: invoice.invoice_url };
  },
});

// ─── Create Portal Session ───────────────────────────────────
// Xendit has no hosted billing portal — redirect to internal manage page

export const createPortalSession = action({
  args: { userId: v.id('users') },
  handler: async (_ctx, _args): Promise<{ portalUrl: string }> => {
    const appUrl = getAppUrl();
    return { portalUrl: `${appUrl}/subscription/manage` };
  },
});

// ─── Verify Checkout Session ─────────────────────────────────
// Xendit appends ?id=<invoice_id> to success redirect URLs

export const verifyCheckoutSession = action({
  args: { externalId: v.string() },
  handler: async (
    ctx,
    args
  ): Promise<{
    status: string;
    tier: string;
    customerEmail: string | null;
  }> => {
    // Look up invoice by external_id
    const response = await fetch(
      `https://api.xendit.co/v2/invoices?external_id=${encodeURIComponent(args.externalId)}&limit=1`,
      { headers: { Authorization: xenditAuthHeader() } }
    );

    if (!response.ok) {
      throw new Error(`Failed to retrieve Xendit invoice for external_id: ${args.externalId}`);
    }

    const invoices = await response.json() as XenditInvoice[];
    const invoice = invoices[0];

    if (!invoice) {
      return { status: 'pending', tier: 'unknown', customerEmail: null };
    }

    const isPaid = invoice.status === 'PAID' || invoice.status === 'SETTLED';
    const status = isPaid
      ? 'complete'
      : invoice.status === 'EXPIRED'
        ? 'expired'
        : 'open';

    // If paid, ensure the subscription record exists in Convex immediately.
    // The webhook may arrive later — this prevents a race condition where
    // the user is redirected to /subscription/manage before the webhook fires.
    if (isPaid) {
      const userId = invoice.metadata?.userId;
      const tier = invoice.metadata?.tier as 'pro' | 'expert' | undefined;
      if (userId && (tier === 'pro' || tier === 'expert')) {
        const config = getTierConfig(tier);
        const now = new Date();
        const oneYearLater = new Date(now);
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

        await ctx.runMutation(api.subscriptions.upsertSubscription, {
          userId: userId as Id<'users'>,
          tier,
          status: 'active',
          xenditCustomerId: userId,
          xenditSubscriptionId: invoice.id,
          xenditPlanId: tier,
          currentPeriodStart: now.toISOString(),
          currentPeriodEnd: oneYearLater.toISOString(),
          cancelAtPeriodEnd: false,
          applicationsLimit: config.applicationsLimit,
        });
      }
    }

    return {
      status,
      tier: invoice.metadata?.tier ?? 'unknown',
      customerEmail: invoice.payer_email ?? null,
    };
  },
});

// ─── Create Internship Checkout Session ─────────────────────

export const createInternshipCheckoutSession = action({
  args: {
    userId: v.id('users'),
    companyId: v.id('institutionProfiles'),
    internshipIds: v.array(v.id('internships')),
  },
  handler: async (ctx, args): Promise<{ sessionUrl: string }> => {
    const appUrl = getAppUrl();
    const user = await ctx.runQuery(api.auth.getCurrentUser, { userId: args.userId });
    if (!user) throw new Error('User not found');

    const internshipIdsStr = args.internshipIds.join(',');
    const totalAmount = args.internshipIds.length * 15; // RM 15 per listing
    const externalId = `internship-${args.companyId}-${Date.now()}`;

    const invoice = await createXenditInvoice({
      externalId,
      amount: totalAmount,
      currency: 'MYR',
      description: `Internship Listing(s) — ${args.internshipIds.length} posting(s) on Pathfindr`,
      payerEmail: user.email,
      payerName: user.fullName ?? user.email,
      successRedirectUrl: `${appUrl}/dashboard/internships/success`,
      failureRedirectUrl: `${appUrl}/dashboard/internships/billing`,
      metadata: {
        userId: args.userId,
        companyId: args.companyId,
        internshipIds: internshipIdsStr,
        paymentType: 'internship_listing',
        externalId,
      },
    });

    return { sessionUrl: invoice.invoice_url };
  },
});

// ─── Handle Webhook ──────────────────────────────────────────

export const handleWebhook = action({
  args: {
    payload: v.string(),
    callbackToken: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event: any = JSON.parse(args.payload);

    // Xendit invoice webhook — status PAID or SETTLED
    const status: string = event.status;
    if (status !== 'PAID' && status !== 'SETTLED') {
      return { success: true }; // Ignore non-payment events
    }

    const metadata: Record<string, string> = event.metadata ?? {};
    const paymentType = metadata.paymentType;

    if (paymentType === 'internship_listing') {
      const companyId = metadata.companyId;
      const internshipIdsString = metadata.internshipIds;
      if (!companyId || !internshipIdsString) return { success: true };

      const internshipIds = internshipIdsString.split(',') as Id<'internships'>[];
      const amount = event.amount as number;

      const paymentId = await ctx.runMutation(api.internshipPayments.createPayment, {
        companyId: companyId as Id<'institutionProfiles'>,
        internshipIds,
        amount,
      });

      await ctx.runMutation(api.internshipPayments.markAsPaid, {
        paymentId,
        xenditInvoiceId: event.id as string,
      });
    } else if (paymentType === 'corporate_donation') {
      const userId = metadata.userId;
      const companyId = metadata.companyId;
      const tier = metadata.tier as 'pro' | 'expert';
      const quantity = parseInt(metadata.quantity || '0', 10);

      if (!userId || !companyId || !tier || !quantity) return { success: true };

      const totalAmount = event.amount as number;

      const companyProfile = await ctx.runQuery(
        api.corporateDonations.getCompanyProfile,
        { userId: userId as Id<'users'> }
      );
      const couponCode = generateDonationCouponCode(
        companyProfile?.institutionName ?? 'PFD'
      );

      const donationId = await ctx.runMutation(
        api.corporateDonations.createDonation,
        {
          corporateUserId: userId as Id<'users'>,
          companyId: companyId as Id<'institutionProfiles'>,
          tier,
          quantityPurchased: quantity,
          totalAmountPaid: totalAmount,
          currency: 'myr',
          xenditInvoiceId: event.id as string,
          xenditExternalId: event.external_id as string,
          couponCode,
        }
      );

      const result = await ctx.runAction(
        api.corporateDonationActions.autoAssignDonations,
        { donationId }
      );

      await ctx.runAction(
        api.corporateDonationActions.sendDonationReceiptEmail,
        {
          corporateUserId: userId as Id<'users'>,
          quantity,
          totalAmount,
          couponCode,
          assignedCount: result.assignedCount,
          remainingBalance: result.remainingBalance,
        }
      );
    } else {
      // Subscription payment
      const userId = metadata.userId;
      const tier = metadata.tier as 'pro' | 'expert';

      if (!userId || !tier) return { success: true };

      const config = getTierConfig(tier);
      const now = new Date();
      const oneYearLater = new Date(now);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      await ctx.runMutation(api.subscriptions.upsertSubscription, {
        userId: userId as Id<'users'>,
        tier,
        status: 'active',
        xenditCustomerId: userId, // Xendit has no customer object; use userId
        xenditSubscriptionId: event.id as string,
        xenditPlanId: tier,
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: oneYearLater.toISOString(),
        cancelAtPeriodEnd: false,
        applicationsLimit: config.applicationsLimit,
      });

      await ctx.runAction(api.notificationActions.sendPaymentSuccessEmail, {
        userId: userId as Id<'users'>,
        tier,
      });
    }

    return { success: true };
  },
});
