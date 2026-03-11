import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// List institutions with optional approval status filter
export const listInstitutions = query({
  args: {
    status: v.optional(
      v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected'))
    ),
  },
  handler: async (ctx, args) => {
    let profiles;
    if (args.status) {
      profiles = await ctx.db
        .query('institutionProfiles')
        .withIndex('by_approval_status', (q) =>
          q.eq('approvalStatus', args.status!)
        )
        .collect();
    } else {
      profiles = await ctx.db.query('institutionProfiles').collect();
    }

    // Enrich with user info
    const enriched = await Promise.all(
      profiles.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        return {
          ...profile,
          userEmail: user?.email ?? 'Unknown',
          userPhone: user?.phone ?? 'Unknown',
        };
      })
    );

    return enriched;
  },
});

// Approve an institution
export const approveInstitution = mutation({
  args: {
    institutionUserId: v.id('users'),
    adminUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Verify admin role
    const admin = await ctx.db.get(args.adminUserId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('Only admins can approve institutions');
    }

    const profile = await ctx.db
      .query('institutionProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.institutionUserId))
      .first();

    if (!profile) {
      throw new Error('Institution profile not found');
    }

    await ctx.db.patch(profile._id, {
      approvalStatus: 'approved',
      approvedBy: args.adminUserId,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return profile._id;
  },
});

// Reject an institution
export const rejectInstitution = mutation({
  args: {
    institutionUserId: v.id('users'),
    adminUserId: v.id('users'),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify admin role
    const admin = await ctx.db.get(args.adminUserId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('Only admins can reject institutions');
    }

    const profile = await ctx.db
      .query('institutionProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.institutionUserId))
      .first();

    if (!profile) {
      throw new Error('Institution profile not found');
    }

    await ctx.db.patch(profile._id, {
      approvalStatus: 'rejected',
      rejectionReason: args.reason,
      updatedAt: new Date().toISOString(),
    });

    return profile._id;
  },
});
