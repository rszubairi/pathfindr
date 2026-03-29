import { query } from './_generated/server';
import { v } from 'convex/values';

export const listUsers = query({
  args: {
    role: v.optional(v.union(
      v.literal('student'),
      v.literal('institution'),
      v.literal('philanthropist'),
      v.literal('admin'),
      v.literal('corporate')
    )),
  },
  handler: async (ctx, args) => {
    let usersQuery = ctx.db.query('users');
    
    // Note: No index on role yet, using filter for now
    if (args.role) {
      usersQuery = usersQuery.filter((q) => q.eq(q.field('role'), args.role));
    }
    
    const users = await usersQuery.collect();

    const enriched = await Promise.all(
      users.map(async (user) => {
        const subscription = await ctx.db
          .query('subscriptions')
          .withIndex('by_user_id', (q) => q.eq('userId', user._id))
          .order('desc')
          .first();

        return {
          ...user,
          subscription: subscription ? {
            status: subscription.status,
            tier: subscription.tier,
            currentPeriodEnd: subscription.currentPeriodEnd,
          } : null,
        };
      })
    );

    return enriched;
  },
});
