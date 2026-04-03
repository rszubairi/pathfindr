import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

export const createKidProfile = mutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    dateOfBirth: v.string(),
    grade: v.string(),
    learningGoals: v.optional(v.array(v.string())),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const kidProfileId = await ctx.db.insert('kidProfiles', {
      userId: args.userId,
      name: args.name,
      dateOfBirth: args.dateOfBirth,
      grade: args.grade,
      learningGoals: args.learningGoals,
      avatarUrl: args.avatarUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return kidProfileId;
  },
});

export const getKidProfiles = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('kidProfiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

export const getKidProfileById = query({
  args: { kidProfileId: v.id('kidProfiles'), userId: v.id('users') },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.kidProfileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    if (profile.userId !== args.userId) {
      throw new Error('Unauthorized');
    }

    return profile;
  },
});

export const updateKidProfile = mutation({
  args: {
    kidProfileId: v.id('kidProfiles'),
    userId: v.id('users'),
    name: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    grade: v.optional(v.string()),
    learningGoals: v.optional(v.array(v.string())),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.kidProfileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    if (profile.userId !== args.userId) {
      throw new Error('Unauthorized');
    }

    const { kidProfileId, userId, ...updates } = args;
    await ctx.db.patch(kidProfileId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return kidProfileId;
  },
});

export const deleteKidProfile = mutation({
  args: { kidProfileId: v.id('kidProfiles'), userId: v.id('users') },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.kidProfileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    if (profile.userId !== args.userId) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.kidProfileId);
    return args.kidProfileId;
  },
});
