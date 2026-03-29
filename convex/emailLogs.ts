import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const listLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query('emailLogs')
      .withIndex('by_sent_at')
      .order('desc')
      .take(args.limit ?? 100);

    return logs;
  },
});

export const createLog = mutation({
  args: {
    recipientEmail: v.string(),
    subject: v.string(),
    body: v.string(),
    userId: v.optional(v.id('users')),
    type: v.string(),
    status: v.union(v.literal('sent'), v.literal('failed')),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert('emailLogs', {
      ...args,
      sentAt: new Date().toISOString(),
    });
    return logId;
  },
});
