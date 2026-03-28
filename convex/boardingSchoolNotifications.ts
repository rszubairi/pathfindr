import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const hasUserSubscribed = query({
  args: {
    userId: v.id('users'),
    schoolId: v.id('boardingSchools'),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('boardingSchoolNotifications')
      .withIndex('by_user_and_school', (q) => 
        q.eq('userId', args.userId).eq('schoolId', args.schoolId)
      )
      .first();
    return !!existing;
  },
});

export const subscribe = mutation({
  args: {
    userId: v.id('users'),
    schoolId: v.id('boardingSchools'),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('boardingSchoolNotifications')
      .withIndex('by_user_and_school', (q) => 
        q.eq('userId', args.userId).eq('schoolId', args.schoolId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert('boardingSchoolNotifications', {
      userId: args.userId,
      schoolId: args.schoolId,
      email: args.email,
      createdAt: new Date().toISOString(),
    });
  },
});

export const unsubscribe = mutation({
  args: {
    userId: v.id('users'),
    schoolId: v.id('boardingSchools'),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('boardingSchoolNotifications')
      .withIndex('by_user_and_school', (q) => 
        q.eq('userId', args.userId).eq('schoolId', args.schoolId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getSubscriberCountForSchool = query({
  args: { schoolId: v.id('boardingSchools') },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query('boardingSchoolNotifications')
      .withIndex('by_school_id', (q) => q.eq('schoolId', args.schoolId))
      .collect();
    return records.length;
  },
});
