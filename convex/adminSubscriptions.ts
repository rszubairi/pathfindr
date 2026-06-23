import { query } from './_generated/server';
import { v } from 'convex/values';

export const listSubscriptions = query({
  args: {
    status: v.optional(v.union(
      v.literal('active'),
      v.literal('canceled'),
      v.literal('past_due'),
      v.literal('incomplete')
    )),
  },
  handler: async (ctx, args) => {
    const subscriptions = await (args.status
      ? ctx.db
          .query('subscriptions')
          .withIndex('by_status', (q) => q.eq('status', args.status!))
      : ctx.db.query('subscriptions')
    )
      .order('desc')
      .collect();

    const enriched = await Promise.all(
      subscriptions.map(async (sub) => {
        const user = await ctx.db.get(sub.userId);
        return {
          ...sub,
          userName: user?.fullName ?? 'Unknown User',
          userEmail: user?.email ?? 'Unknown Email',
        };
      })
    );

    return enriched;
  },
});

export const getSubscriptionStats = query({
  args: {},
  handler: async (ctx) => {
    const activeSubscriptions = await ctx.db
      .query('subscriptions')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();

    const allInvoices = await ctx.db.query('invoices').collect();
    const paidInvoices = allInvoices.filter(
      (inv) => inv.status === 'generated' || inv.status === 'sent'
    );

    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + (inv.amount ?? 0), 0);
    const avgCheckout = paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0;

    return {
      totalActive: activeSubscriptions.length,
      totalRevenue,
      avgCheckout,
      totalTransactions: paidInvoices.length,
    };
  },
});

export const listAllInvoices = query({
  args: {},
  handler: async (ctx) => {
    const invoices = await ctx.db
      .query('invoices')
      .order('desc')
      .collect();

    return await Promise.all(
      invoices.map(async (inv) => {
        const user = await ctx.db.get(inv.userId);
        return {
          ...inv,
          userName: user?.fullName ?? inv.customerName,
          userEmail: user?.email ?? inv.customerEmail,
        };
      })
    );
  },
});
