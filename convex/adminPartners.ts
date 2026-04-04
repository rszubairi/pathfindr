import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// ─── Queries ─────────────────────────────────────────────────

// List all partner profiles with optional status filter
export const listPartners = query({
  args: {
    status: v.optional(
      v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected'))
    ),
  },
  handler: async (ctx, args) => {
    let profiles;
    if (args.status) {
      profiles = await ctx.db
        .query('partnerProfiles')
        .withIndex('by_approval_status', (q) => q.eq('approvalStatus', args.status!))
        .collect();
    } else {
      profiles = await ctx.db.query('partnerProfiles').collect();
    }

    const enriched = await Promise.all(
      profiles.map(async (profile) => {
        // Count students referred via this partner
        const referralCount = (
          await ctx.db
            .query('partnerReferrals')
            .withIndex('by_partner_profile', (q) => q.eq('partnerProfileId', profile._id))
            .collect()
        ).length;

        return {
          ...profile,
          referralCount,
        };
      })
    );

    return enriched;
  },
});

// Get a single partner profile by id (used internally by actions)
export const getPartnerProfileById = query({
  args: { profileId: v.id('partnerProfiles') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.profileId);
  },
});

// ─── Mutations ────────────────────────────────────────────────

// Create a user account for an approved partner (called from partnerActions.approvePartner)
export const createPartnerUserAccount = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();

    // Check duplicate email
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existing) {
      throw new Error('A user with this email already exists');
    }

    const now = new Date().toISOString();

    const userId = await ctx.db.insert('users', {
      email,
      passwordHash: args.passwordHash,
      fullName: args.fullName,
      phone: args.phone,
      role: 'partner',
      emailVerified: true, // Admin has verified by approving
      profileCompleted: true,
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

// Update partner profile: set approved status + link userId + set commission
export const setPartnerApproved = mutation({
  args: {
    profileId: v.id('partnerProfiles'),
    userId: v.id('users'),
    adminUserId: v.id('users'),
    commissionPercentage: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, {
      userId: args.userId,
      approvalStatus: 'approved',
      approvedBy: args.adminUserId,
      approvedAt: new Date().toISOString(),
      commissionPercentage: args.commissionPercentage,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Update partner profile: set rejected status
export const setPartnerRejected = mutation({
  args: {
    profileId: v.id('partnerProfiles'),
    adminUserId: v.id('users'),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, {
      approvalStatus: 'rejected',
      rejectionReason: args.reason,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Update commission percentage for an existing approved partner
export const updateCommission = mutation({
  args: {
    profileId: v.id('partnerProfiles'),
    adminUserId: v.id('users'),
    commissionPercentage: v.number(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db.get(args.adminUserId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('Only admins can update commission');
    }

    await ctx.db.patch(args.profileId, {
      commissionPercentage: args.commissionPercentage,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Save admin notes on a partner profile
export const updateAdminNotes = mutation({
  args: {
    profileId: v.id('partnerProfiles'),
    adminUserId: v.id('users'),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db.get(args.adminUserId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('Only admins can update notes');
    }

    await ctx.db.patch(args.profileId, {
      adminNotes: args.notes,
      updatedAt: new Date().toISOString(),
    });
  },
});
