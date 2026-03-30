import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createPayment = mutation({
  args: {
    corporateUserId: v.id('users'),
    scholarshipId: v.id('scholarships'),
    amount: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const paymentId = await ctx.db.insert('scholarshipFeaturePayments', {
      corporateUserId: args.corporateUserId,
      scholarshipId: args.scholarshipId,
      amount: args.amount,
      currency: args.currency,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });

    return paymentId;
  },
});

export const markAsPaid = mutation({
  args: {
    paymentId: v.id('scholarshipFeaturePayments'),
    stripePaymentIntentId: v.optional(v.string()),
    stripeCheckoutSessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) throw new Error('Payment record not found');

    const now = new Date();
    const featuredUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now

    await ctx.db.patch(args.paymentId, {
      status: 'completed',
      stripePaymentIntentId: args.stripePaymentIntentId,
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      updatedAt: now.toISOString(),
    });

    await ctx.db.patch(payment.scholarshipId, {
      isFeatured: true,
      featuredUntil: featuredUntil,
      updatedAt: now.toISOString(),
    });
  },
});

export const getCorporatePayments = query({
  args: { corporateUserId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('scholarshipFeaturePayments')
      .withIndex('by_corporate_user', (q) => q.eq('corporateUserId', args.corporateUserId))
      .order('desc')
      .collect();
  },
});
