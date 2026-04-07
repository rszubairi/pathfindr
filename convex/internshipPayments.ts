import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createPayment = mutation({
  args: {
    companyId: v.id('institutionProfiles'),
    internshipIds: v.array(v.id('internships')),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const paymentId = await ctx.db.insert('internshipPayments', {
      companyId: args.companyId,
      internshipIds: args.internshipIds,
      amount: args.amount,
      currency: 'RM',
      status: 'pending',
      createdAt: now,
    });

    // Update internships status to pending_payment
    for (const id of args.internshipIds) {
      await ctx.db.patch(id, {
        status: 'pending_payment',
        updatedAt: now,
      });
    }

    return paymentId;
  },
});

export const markAsPaid = mutation({
  args: {
    paymentId: v.id('internshipPayments'),
    xenditInvoiceId: v.string(),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) throw new Error('Payment record not found');

    await ctx.db.patch(args.paymentId, {
      status: 'completed',
      stripePaymentIntentId: args.xenditInvoiceId, // field reused for Xendit invoice ID
    });

    const now = new Date().toISOString();
    // Mark all associated internships as active and paid
    for (const id of payment.internshipIds) {
      await ctx.db.patch(id, {
        status: 'active',
        paymentStatus: 'paid',
        updatedAt: now,
      });
    }
  },
});

export const getCompanyPayments = query({
  args: { companyId: v.id('institutionProfiles') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('internshipPayments')
      .withIndex('by_company', (q) => q.eq('companyId', args.companyId))
      .order('desc')
      .collect();
  },
});
