import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveProfileImage = mutation({
  args: {
    userId: v.id('users'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');

    // Delete old image if exists
    if (user.profileImageId) {
      await ctx.storage.delete(user.profileImageId);
    }

    await ctx.db.patch(args.userId, {
      profileImageId: args.storageId,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const deleteProfileImage = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');

    if (user.profileImageId) {
      await ctx.storage.delete(user.profileImageId);
      await ctx.db.patch(args.userId, {
        profileImageId: undefined,
        updatedAt: new Date().toISOString(),
      });
    }
  },
});
