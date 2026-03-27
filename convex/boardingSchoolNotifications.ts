import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const hasUserSubscribed = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('boardingSchoolNotifications')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();
    return !!existing;
  },
});

export const subscribe = mutation({
  args: {
    userId: v.id('users'),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('boardingSchoolNotifications')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert('boardingSchoolNotifications', {
      userId: args.userId,
      email: args.email,
      createdAt: new Date().toISOString(),
    });
  },
});

export const unsubscribe = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('boardingSchoolNotifications')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getSubscriberCount = query({
  args: {},
  handler: async (ctx) => {
    const records = await ctx.db
      .query('boardingSchoolNotifications')
      .collect();
    return records.length;
  },
});
