"use node";

import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import Stripe from 'stripe';
import { Resend } from 'resend';

import { getAppUrl as getBaseAppUrl } from './utils';

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

function getAppUrl(): string {
  return getBaseAppUrl();
}

function generateCouponCode(companyName: string): string {
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

// ─── Create Donation Checkout Session ───────────────────────

export const createDonationCheckoutSession = action({
  args: {
    userId: v.id('users'),
    companyId: v.id('institutionProfiles'),
    tier: v.union(v.literal('pro'), v.literal('expert')),
    quantity: v.number(),
  },
  handler: async (ctx, args): Promise<{ sessionUrl: string }> => {
    const stripe = getStripe();
    const appUrl = getAppUrl();

    const user = await ctx.runQuery(api.auth.getCurrentUser, {
      userId: args.userId,
    });
    if (!user) throw new Error('User not found');

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

    const tierName = args.tier === 'pro' ? 'Pro' : 'Expert';
    const unitAmount = args.tier === 'pro' ? 999 : 4999;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Student ${tierName} Subscription Donation`,
              description: `Sponsor ${args.quantity} student ${tierName} subscription(s) for 1 year`,
            },
            unit_amount: unitAmount,
          },
          quantity: args.quantity,
        },
      ],
      success_url: `${appUrl}/dashboard/donations/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/donations/purchase`,
      metadata: {
        userId: args.userId,
        companyId: args.companyId,
        paymentType: 'corporate_donation',
        tier: args.tier,
        quantity: args.quantity.toString(),
      },
    });

    if (!session.url) throw new Error('Failed to create checkout session');
    return { sessionUrl: session.url };
  },
});

// ─── Auto-Assign Donations to Unsubscribed Students ────────

export const autoAssignDonations = action({
  args: { donationId: v.id('corporateDonations') },
  handler: async (ctx, args): Promise<{ assignedCount: number; remainingBalance: number }> => {
    let currentDonation = await ctx.runQuery(
      api.corporateDonations.getDonationById,
      { donationId: args.donationId }
    );

    if (!currentDonation || currentDonation.quantityRemaining <= 0) {
      return { assignedCount: 0, remainingBalance: 0 };
    }

    const unsubscribedStudents = await ctx.runQuery(
      api.corporateDonations.getUnsubscribedStudents,
      {}
    );

    let assignedCount = 0;
    const maxToAssign = Math.min(
      currentDonation.quantityRemaining,
      unsubscribedStudents.length,
      50 // batch limit to avoid Convex time limits
    );

    for (let i = 0; i < maxToAssign; i++) {
      const student = unsubscribedStudents[i];
      try {
        await ctx.runMutation(api.corporateDonations.assignDonationToStudent, {
          donationId: args.donationId,
          studentUserId: student._id,
          claimMethod: 'auto_assigned',
        });

        await ctx.runAction(api.corporateDonationActions.sendDonationNotificationEmail, {
          studentUserId: student._id,
          corporateUserId: currentDonation.corporateUserId,
          tier: currentDonation.tier,
        });

        assignedCount++;
      } catch (err) {
        console.error(`Failed to assign donation to student ${student._id}:`, err);
      }
    }

    currentDonation = await ctx.runQuery(
      api.corporateDonations.getDonationById,
      { donationId: args.donationId }
    );

    return {
      assignedCount,
      remainingBalance: currentDonation?.quantityRemaining ?? 0,
    };
  },
});

// ─── Send Donation Notification to Student ──────────────────

export const sendDonationNotificationEmail = action({
  args: {
    studentUserId: v.id('users'),
    corporateUserId: v.id('users'),
    tier: v.union(v.literal('pro'), v.literal('expert')),
  },
  handler: async (ctx, args) => {
    const student = await ctx.runQuery(api.auth.getCurrentUser, {
      userId: args.studentUserId,
    });
    if (!student) return;

    const profile = await ctx.runQuery(
      api.corporateDonations.getCompanyProfile,
      { userId: args.corporateUserId }
    );

    const companyName = profile?.institutionName ?? 'A generous sponsor';
    const tierName = args.tier === 'pro' ? 'Pro' : 'Expert';
    const appUrl = getAppUrl();
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.log(
        `[DEV] Donation notification to ${student.email}: Sponsored by ${companyName} (${tierName})`
      );
      return;
    }

    const resend = new Resend(resendApiKey);

    try {
      await resend.emails.send({
        from: 'Pathfindr <noreply@thepathfindr.com>',
        to: student.email,
        subject: `Your Pathfindr ${tierName} subscription has been sponsored! 🎓`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Pathfindr</h1>
            </div>
            <h2 style="color: #111827; font-size: 20px;">Great news, ${student.fullName}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              <strong>${companyName}</strong> has generously sponsored your Pathfindr <strong>${tierName}</strong> subscription for one full year!
            </p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #166534; font-size: 18px; margin: 0 0 12px 0;">What you now have access to:</h3>
              <ul style="color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Apply to ${args.tier === 'pro' ? '5' : '20'} scholarships per year</li>
                <li>Full scholarship details & eligibility info</li>
                <li>Application tracking dashboard</li>
                <li>Email notifications for deadlines</li>
                ${args.tier === 'expert' ? '<li>Priority support</li><li>Scholarship match recommendations</li>' : ''}
              </ul>
            </div>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${appUrl}/scholarships" style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                Start Applying for Scholarships
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              This subscription was sponsored by <strong>${companyName}</strong>. Thank you for their support!
            </p>
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              You received this email because your Pathfindr account was selected for a sponsored subscription.
            </p>
          </body>
          </html>
        `,
      });
    } catch (err) {
      console.error(`Failed to send donation notification to ${student.email}:`, err);
    }
  },
});

// ─── Send Donation Receipt to Corporate ─────────────────────

export const sendDonationReceiptEmail = action({
  args: {
    corporateUserId: v.id('users'),
    quantity: v.number(),
    totalAmount: v.number(),
    couponCode: v.string(),
    assignedCount: v.number(),
    remainingBalance: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.auth.getCurrentUser, {
      userId: args.corporateUserId,
    });
    if (!user) return;

    const appUrl = getAppUrl();
    const resendApiKey = process.env.RESEND_API_KEY;
    const claimLink = `${appUrl}/claim/${args.couponCode}`;

    if (!resendApiKey) {
      console.log(
        `[DEV] Donation receipt to ${user.email}: ${args.quantity} subscriptions, coupon: ${args.couponCode}`
      );
      return;
    }

    const resend = new Resend(resendApiKey);

    try {
      await resend.emails.send({
        from: 'Pathfindr <noreply@thepathfindr.com>',
        to: user.email,
        subject: `Thank you for sponsoring ${args.quantity} student subscription${args.quantity > 1 ? 's' : ''}! 🎓`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Pathfindr</h1>
            </div>
            <h2 style="color: #111827; font-size: 20px;">Thank you for your generosity!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Your donation of <strong>${args.quantity} student subscription${args.quantity > 1 ? 's' : ''}</strong> has been processed successfully.
            </p>
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #0369a1; font-size: 18px; margin: 0 0 12px 0;">Donation Summary</h3>
              <p style="color: #4b5563; font-size: 14px; margin: 0 0 4px 0;">
                <strong>Subscriptions:</strong> ${args.quantity}
              </p>
              <p style="color: #4b5563; font-size: 14px; margin: 0 0 4px 0;">
                <strong>Total Amount:</strong> $${args.totalAmount.toFixed(2)} USD
              </p>
              <p style="color: #4b5563; font-size: 14px; margin: 0 0 4px 0;">
                <strong>Auto-Assigned:</strong> ${args.assignedCount} student${args.assignedCount !== 1 ? 's' : ''}
              </p>
              <p style="color: #4b5563; font-size: 14px; margin: 0;">
                <strong>Remaining Balance:</strong> ${args.remainingBalance} subscription${args.remainingBalance !== 1 ? 's' : ''}
              </p>
            </div>
            ${args.remainingBalance > 0 ? `
            <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #854d0e; font-size: 16px; margin: 0 0 8px 0;">Your Coupon Code</h3>
              <p style="font-family: monospace; font-size: 24px; font-weight: bold; color: #111827; text-align: center; margin: 12px 0; letter-spacing: 2px;">
                ${args.couponCode}
              </p>
              <p style="color: #4b5563; font-size: 14px; text-align: center; margin: 8px 0 0 0;">
                Share this link with students: <a href="${claimLink}" style="color: #2563eb;">${claimLink}</a>
              </p>
            </div>
            ` : ''}
            <div style="text-align: center; margin: 32px 0;">
              <a href="${appUrl}/dashboard/donations" style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                View Donation Dashboard
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 32px;">
              Thank you for supporting students through Pathfindr.
            </p>
          </body>
          </html>
        `,
      });
    } catch (err) {
      console.error(`Failed to send donation receipt to ${user.email}:`, err);
    }
  },
});

// ─── Verify Donation Checkout Session ───────────────────────

export const verifyDonationCheckoutSession = action({
  args: { sessionId: v.string() },
  handler: async (
    _ctx,
    args
  ): Promise<{
    status: string;
    tier: string;
    quantity: number;
    couponCode: string | null;
  }> => {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(args.sessionId);

    // Look up the donation by checkout session ID
    return {
      status: session.status ?? 'unknown',
      tier: session.metadata?.tier ?? 'unknown',
      quantity: parseInt(session.metadata?.quantity || '0', 10),
      couponCode: null, // Will be set after webhook processes
    };
  },
});

