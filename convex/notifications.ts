import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get user's active scholarship notifications
export const getScholarshipNotifications = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query('scholarshipNotifications')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    const results = [];
    for (const notification of notifications) {
      const scholarship = await ctx.db.get(notification.scholarshipId);
      if (scholarship && scholarship.status === 'active') {
        results.push({
          ...notification,
          scholarshipName: scholarship.name,
          deadline: scholarship.deadline,
        });
      }
    }
    
    // Sort by most recent first
    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});

// Check if a user has already subscribed to notifications for a scholarship
export const hasUserSubscribed = query({
  args: {
    userId: v.id('users'),
    scholarshipId: v.id('scholarships'),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('scholarshipNotifications')
      .withIndex('by_user_and_scholarship', (q) =>
        q.eq('userId', args.userId).eq('scholarshipId', args.scholarshipId)
      )
      .first();
    return !!existing;
  },
});

// Get count of users who want to be notified for a scholarship
export const getNotifyCount = query({
  args: {
    scholarshipId: v.id('scholarships'),
  },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query('scholarshipNotifications')
      .withIndex('by_scholarship_id', (q) =>
        q.eq('scholarshipId', args.scholarshipId)
      )
      .collect();
    return records.length;
  },
});

// Subscribe to notifications for a scholarship
export const subscribe = mutation({
  args: {
    userId: v.id('users'),
    scholarshipId: v.id('scholarships'),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Prevent duplicates
    const existing = await ctx.db
      .query('scholarshipNotifications')
      .withIndex('by_user_and_scholarship', (q) =>
        q.eq('userId', args.userId).eq('scholarshipId', args.scholarshipId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert('scholarshipNotifications', {
      userId: args.userId,
      scholarshipId: args.scholarshipId,
      email: args.email,
      notified: false,
      createdAt: new Date().toISOString(),
    });
  },
});

// Get all un-notified subscriptions for a scholarship (used by notification action)
export const getUnnotifiedSubscriptions = query({
  args: {
    scholarshipId: v.id('scholarships'),
  },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query('scholarshipNotifications')
      .withIndex('by_scholarship_id', (q) =>
        q.eq('scholarshipId', args.scholarshipId)
      )
      .collect();
    return records.filter((r) => !r.notified);
  },
});

// Mark a notification record as notified
export const markNotified = mutation({
  args: {
    notificationId: v.id('scholarshipNotifications'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { notified: true });
  },
});

// Unsubscribe from notifications for a scholarship
export const unsubscribe = mutation({
  args: {
    userId: v.id('users'),
    scholarshipId: v.id('scholarships'),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('scholarshipNotifications')
      .withIndex('by_user_and_scholarship', (q) =>
        q.eq('userId', args.userId).eq('scholarshipId', args.scholarshipId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

// Redeplyment sync
