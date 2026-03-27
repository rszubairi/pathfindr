"use node";

import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import Stripe from 'stripe';
import { Id } from './_generated/dataModel';

// Lazy-init to avoid module-level errors during Convex analysis
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

function getTierConfig(tier: 'pro' | 'expert') {
  const configs = {
    pro: { priceId: process.env.STRIPE_PRO_PRICE_ID!, applicationsLimit: 5 },
    expert: { priceId: process.env.STRIPE_EXPERT_PRICE_ID!, applicationsLimit: 20 },
  };
  return configs[tier];
}

function getTierFromPriceId(priceId: string): 'pro' | 'expert' {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro';
  if (priceId === process.env.STRIPE_EXPERT_PRICE_ID) return 'expert';
  throw new Error(`Unknown price ID: ${priceId}`);
}

// Stripe v20: period info is on subscription items, not the subscription itself
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSubscriptionPeriod(sub: any): { start: string; end: string } {
  // Try item-level period (Stripe v20+)
  const item = sub.items?.data?.[0];
  if (item?.current_period_start && item?.current_period_end) {
    return {
      start: new Date(item.current_period_start * 1000).toISOString(),
      end: new Date(item.current_period_end * 1000).toISOString(),
    };
  }
  // Fallback to subscription-level (older API versions)
  if (sub.current_period_start && sub.current_period_end) {
    return {
      start: new Date(sub.current_period_start * 1000).toISOString(),
      end: new Date(sub.current_period_end * 1000).toISOString(),
    };
  }
  // Last resort: use created + 1 year
  const now = new Date();
  const oneYear = new Date(now);
  oneYear.setFullYear(oneYear.getFullYear() + 1);
  return { start: now.toISOString(), end: oneYear.toISOString() };
}

// Stripe v20: invoice.subscription moved to invoice.parent.subscription_details
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getInvoiceSubscriptionId(invoice: any): string | null {
  // Try v20 parent structure
  if (invoice.parent?.subscription_details?.subscription) {
    const sub = invoice.parent.subscription_details.subscription;
    return typeof sub === 'string' ? sub : sub.id;
  }
  // Fallback for older API versions
  if (invoice.subscription) {
    return typeof invoice.subscription === 'string'
      ? invoice.subscription
      : invoice.subscription.id;
  }
  return null;
}

// ─── Create Checkout Session ────────────────────────────────

export const createCheckoutSession = action({
  args: {
    userId: v.id('users'),
    tier: v.union(v.literal('pro'), v.literal('expert')),
  },
  handler: async (ctx, args): Promise<{ sessionUrl: string }> => {
    const stripe = getStripe();
    const appUrl = getAppUrl();
    const config = getTierConfig(args.tier);

    const user = await ctx.runQuery(api.auth.getCurrentUser, {
      userId: args.userId,
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Find or create Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: { userId: args.userId },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      client_reference_id: args.userId,
      metadata: {
        userId: args.userId,
        tier: args.tier,
      },
      subscription_data: {
        metadata: {
          userId: args.userId,
          tier: args.tier,
        },
      },
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session');
    }

    return { sessionUrl: session.url };
  },
});

// ─── Create Portal Session ──────────────────────────────────

export const createPortalSession = action({
  args: { userId: v.id('users') },
  handler: async (ctx, args): Promise<{ portalUrl: string }> => {
    const stripe = getStripe();
    const appUrl = getAppUrl();

    const subscription = await ctx.runQuery(
      api.subscriptions.getUserSubscription,
      { userId: args.userId }
    );

    if (!subscription) {
      throw new Error('No subscription found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${appUrl}/subscription/manage`,
    });

    return { portalUrl: session.url };
  },
});

// ─── Verify Checkout Session ────────────────────────────────

export const verifyCheckoutSession = action({
  args: { sessionId: v.string() },
  handler: async (
    _ctx,
    args
  ): Promise<{
    status: string;
    tier: string;
    customerEmail: string | null;
  }> => {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(args.sessionId);

    return {
      status: session.status ?? 'unknown',
      tier: (session.metadata?.tier as string) ?? 'unknown',
      customerEmail: session.customer_details?.email ?? null,
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
    const stripe = getStripe();
    const appUrl = getAppUrl();
    const user = await ctx.runQuery(api.auth.getCurrentUser, { userId: args.userId });
    if (!user) throw new Error('User not found');

    // RM15 per listing
    const internshipIdsStr = args.internshipIds.join(',');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: (await stripe.customers.list({ email: user.email, limit: 1 })).data[0]?.id || 
               (await stripe.customers.create({ email: user.email, name: user.fullName, metadata: { userId: args.userId } })).id,
      line_items: [
        {
          price_data: {
            currency: 'myr',
            product_data: {
              name: 'Internship Listing(s)',
              description: `Payment for ${args.internshipIds.length} internship listing(s) on Pathfindr.`,
            },
            unit_amount: 1500, // 15 MYR in cents
          },
          quantity: args.internshipIds.length,
        },
      ],
      success_url: `${appUrl}/dashboard/internships/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/internships/billing`,
      metadata: {
        userId: args.userId,
        companyId: args.companyId,
        internshipIds: internshipIdsStr,
        paymentType: 'internship_listing',
      },
    });

    if (!session.url) throw new Error('Failed to create checkout session');
    return { sessionUrl: session.url };
  },
});

// ─── Handle Webhook ─────────────────────────────────────────

export const handleWebhook = action({
  args: {
    payload: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        args.payload,
        args.signature,
        webhookSecret
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentType = session.metadata?.paymentType;

        if (paymentType === 'internship_listing') {
          const companyId = session.metadata?.companyId;
          const internshipIdsString = session.metadata?.internshipIds;
          if (!companyId || !internshipIdsString) break;

          const internshipIds = internshipIdsString.split(',') as Id<'internships'>[];
          const amount = (session.amount_total || 0) / 100;

          const paymentId = await ctx.runMutation(api.internshipPayments.createPayment, {
            companyId: companyId as Id<'institutionProfiles'>,
            internshipIds,
            amount,
          });

          await ctx.runMutation(api.internshipPayments.markAsPaid, {
            paymentId,
            stripePaymentIntentId: session.payment_intent as string,
          });
        } else {
          // Subscription logic
          const userId = session.metadata?.userId;
          const tier = session.metadata?.tier as 'pro' | 'expert';

          if (!userId || !tier) break;

          const stripeSubscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const priceId = stripeSubscription.items.data[0].price.id;
          const period = getSubscriptionPeriod(stripeSubscription);

          await ctx.runMutation(api.subscriptions.upsertSubscription, {
            userId: userId as Id<'users'>,
            tier,
            status: 'active',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: priceId,
            currentPeriodStart: period.start,
            currentPeriodEnd: period.end,
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            applicationsLimit: getTierConfig(tier).applicationsLimit,
          });
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getInvoiceSubscriptionId(invoice);

        if (!subscriptionId) break;

        if (invoice.billing_reason === 'subscription_cycle') {
          await ctx.runMutation(api.subscriptions.resetApplicationCount, {
            stripeSubscriptionId: subscriptionId,
          });
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        const period = getSubscriptionPeriod(stripeSubscription);

        await ctx.runMutation(api.subscriptions.updateSubscriptionStatus, {
          stripeSubscriptionId: subscriptionId,
          status: 'active',
          currentPeriodStart: period.start,
          currentPeriodEnd: period.end,
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0].price.id;

        let tier: 'pro' | 'expert';
        try {
          tier = getTierFromPriceId(priceId);
        } catch {
          break;
        }

        const status = subscription.status === 'active'
          ? 'active'
          : subscription.status === 'past_due'
            ? 'past_due'
            : subscription.status === 'canceled'
              ? 'canceled'
              : 'incomplete';

        const period = getSubscriptionPeriod(subscription);

        await ctx.runMutation(api.subscriptions.updateSubscriptionStatus, {
          stripeSubscriptionId: subscription.id,
          status: status as 'active' | 'canceled' | 'past_due' | 'incomplete',
          currentPeriodStart: period.start,
          currentPeriodEnd: period.end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          tier,
          applicationsLimit: getTierConfig(tier).applicationsLimit,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await ctx.runMutation(api.subscriptions.updateSubscriptionStatus, {
          stripeSubscriptionId: subscription.id,
          status: 'canceled',
        });
        break;
      }
    }

    return { success: true };
  },
});
