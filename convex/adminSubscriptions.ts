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

    // Estimate revenue (assuming Pro = $199, Expert = $499)
    // In a real app, we'd store the actual amount or fetch from Stripe
    const totalRevenue = activeSubscriptions.reduce((acc, sub) => {
      const amount = sub.tier === 'expert' ? 499 : 199;
      return acc + amount;
    }, 0);

    const avgCheckout = activeSubscriptions.length > 0 
      ? totalRevenue / activeSubscriptions.length 
      : 0;

    return {
      totalActive: activeSubscriptions.length,
      totalRevenue,
      avgCheckout,
    };
  },
});
