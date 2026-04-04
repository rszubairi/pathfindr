import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// ─── Queries ─────────────────────────────────────────────────

// Get partner profile by userId (for logged-in partner)
export const getPartnerProfileByUserId = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('partnerProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();
  },
});

// Get partner profile by email (for pre-approval lookup)
export const getPartnerProfileByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('partnerProfiles')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .first();
  },
});

// Validate a partner code (used during student registration)
export const validatePartnerCode = query({
  args: { partnerCode: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('partnerProfiles')
      .withIndex('by_partner_code', (q) =>
        q.eq('partnerCode', args.partnerCode.trim().toUpperCase())
      )
      .first();

    if (!profile || profile.approvalStatus !== 'approved') {
      return { valid: false };
    }

    return {
      valid: true,
      partnerName: profile.companyName || profile.personInChargeName,
      partnerCode: profile.partnerCode,
    };
  },
});

// Get students referred by this partner (for partner dashboard)
export const getPartnerStudents = query({
  args: { partnerProfileId: v.id('partnerProfiles') },
  handler: async (ctx, args) => {
    const referrals = await ctx.db
      .query('partnerReferrals')
      .withIndex('by_partner_profile', (q) =>
        q.eq('partnerProfileId', args.partnerProfileId)
      )
      .collect();

    const students = await Promise.all(
      referrals.map(async (referral) => {
        const user = await ctx.db.get(referral.studentUserId);
        if (!user) return null;

        // Check if student has an active subscription
        const subscriptions = await ctx.db
          .query('subscriptions')
          .withIndex('by_user_id', (q) => q.eq('userId', referral.studentUserId))
          .collect();
        const activeSub = subscriptions.find((s) => s.status === 'active');

        return {
          referralId: referral._id,
          userId: user._id,
          fullName: user.fullName,
          email: user.email,
          joinedAt: referral.createdAt,
          hasActiveSubscription: !!activeSub,
          subscriptionTier: activeSub?.tier ?? null,
          subscriptionEnd: activeSub?.currentPeriodEnd ?? null,
        };
      })
    );

    return students.filter(Boolean);
  },
});

// Get earnings summary for partner (students with active paid subscriptions)
export const getPartnerEarnings = query({
  args: { partnerProfileId: v.id('partnerProfiles') },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.partnerProfileId);
    if (!profile) return null;

    const referrals = await ctx.db
      .query('partnerReferrals')
      .withIndex('by_partner_profile', (q) =>
        q.eq('partnerProfileId', args.partnerProfileId)
      )
      .collect();

    const earningsData = await Promise.all(
      referrals.map(async (referral) => {
        const user = await ctx.db.get(referral.studentUserId);
        if (!user) return null;

        const subscriptions = await ctx.db
          .query('subscriptions')
          .withIndex('by_user_id', (q) => q.eq('userId', referral.studentUserId))
          .collect();

        // Only include non-donated, non-referral-reward (real paid) subscriptions
        const paidSubs = subscriptions.filter(
          (s) =>
            s.status === 'active' &&
            !s.isDonated &&
            !s.isReferralReward
        );

        return {
          studentUserId: user._id,
          studentName: user.fullName,
          studentEmail: user.email,
          joinedAt: referral.createdAt,
          paidSubscriptions: paidSubs.map((s) => ({
            tier: s.tier,
            currentPeriodStart: s.currentPeriodStart,
            currentPeriodEnd: s.currentPeriodEnd,
          })),
          hasPaidSubscription: paidSubs.length > 0,
        };
      })
    );

    const validData = earningsData.filter(Boolean) as NonNullable<typeof earningsData[0]>[];

    return {
      commissionPercentage: profile.commissionPercentage ?? 0,
      totalReferred: referrals.length,
      studentsWithPaidSubs: validData.filter((d) => d.hasPaidSubscription).length,
      students: validData,
    };
  },
});

// ─── Mutations ────────────────────────────────────────────────

// Create a pending partner profile (called during registration)
export const createPartnerProfile = mutation({
  args: {
    partnerType: v.union(v.literal('individual'), v.literal('company')),
    companyName: v.optional(v.string()),
    personInChargeName: v.string(),
    location: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();

    // Check for duplicate registration
    const existing = await ctx.db
      .query('partnerProfiles')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existing) {
      throw new Error('A registration with this email already exists');
    }

    // Generate unique partner code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let partnerCode = '';
    for (let i = 0; i < 8; i++) {
      partnerCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const now = new Date().toISOString();

    const profileId = await ctx.db.insert('partnerProfiles', {
      partnerType: args.partnerType,
      companyName: args.companyName,
      personInChargeName: args.personInChargeName,
      location: args.location,
      address: args.address,
      phone: args.phone,
      email,
      website: args.website,
      partnerCode,
      approvalStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    });

    return { profileId, partnerCode };
  },
});

// Update partner profile (by the partner themselves after approval)
export const updatePartnerProfile = mutation({
  args: {
    profileId: v.id('partnerProfiles'),
    personInChargeName: v.optional(v.string()),
    location: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    companyName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { profileId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(profileId, {
      ...filtered,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Record a student referral via partner code
export const recordPartnerReferral = mutation({
  args: {
    partnerCode: v.string(),
    studentUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const code = args.partnerCode.trim().toUpperCase();

    const profile = await ctx.db
      .query('partnerProfiles')
      .withIndex('by_partner_code', (q) => q.eq('partnerCode', code))
      .first();

    if (!profile || profile.approvalStatus !== 'approved') return null;

    // Check not already referred by this partner
    const existing = await ctx.db
      .query('partnerReferrals')
      .withIndex('by_student', (q) => q.eq('studentUserId', args.studentUserId))
      .first();

    if (existing) return null; // Student already has a partner referral

    const now = new Date().toISOString();
    await ctx.db.insert('partnerReferrals', {
      partnerProfileId: profile._id,
      partnerUserId: profile.userId,
      studentUserId: args.studentUserId,
      partnerCode: code,
      createdAt: now,
    });

    return profile._id;
  },
});
