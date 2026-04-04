import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// ─── Queries ────────────────────────────────────────────────

export const getCurrentUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const { passwordHash, verificationToken, tokenExpiry, ...safeUser } = user;

    let profileImageUrl: string | null = null;
    if (user.profileImageId) {
      profileImageUrl = await ctx.storage.getUrl(user.profileImageId);
    }

    return { ...safeUser, profileImageUrl };
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .first();
  },
});

// ─── Mutations ──────────────────────────────────────────────

export const createUser = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
    phone: v.string(),
    verificationToken: v.string(),
    referredByCode: v.optional(v.string()),
    partnerCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();

    // Check for duplicate email
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existing) {
      throw new Error('An account with this email already exists');
    }

    const now = new Date().toISOString();
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const userId = await ctx.db.insert('users', {
      email,
      passwordHash: args.passwordHash,
      fullName: args.fullName,
      phone: args.phone,
      role: 'student',
      emailVerified: false,
      verificationToken: args.verificationToken,
      tokenExpiry,
      profileCompleted: false,
      createdAt: now,
      updatedAt: now,
    });

    // Handle referral code — create referral record if valid
    if (args.referredByCode) {
      const code = args.referredByCode.trim().toUpperCase();
      const referrer = await ctx.db
        .query('users')
        .withIndex('by_referral_code', (q) => q.eq('referralCode', code))
        .first();

      if (referrer && referrer._id !== userId) {
        // Check this user hasn't already been referred
        const existingReferral = await ctx.db
          .query('referrals')
          .withIndex('by_referred', (q) => q.eq('referredUserId', userId))
          .first();

        if (!existingReferral) {
          // Create referral record
          const referralId = await ctx.db.insert('referrals', {
            referrerUserId: referrer._id,
            referredUserId: userId,
            status: 'registered',
            createdAt: now,
          });

          // Check if this triggers a reward (every 5th referral)
          const allReferrals = await ctx.db
            .query('referrals')
            .withIndex('by_referrer', (q) => q.eq('referrerUserId', referrer._id))
            .collect();

          const totalCount = allReferrals.length;

          if (totalCount > 0 && totalCount % 5 === 0) {
            const unrewarded = allReferrals
              .filter((r) => r.status === 'registered')
              .slice(0, 5);
            const referralIds = unrewarded.map((r) => r._id);

            // Check if referrer has an active subscription
            const subs = await ctx.db
              .query('subscriptions')
              .withIndex('by_user_id', (q) => q.eq('userId', referrer._id))
              .collect();
            const activeSub = subs.find((s) => s.status === 'active');

            if (!activeSub) {
              // Create Pro subscription for the referrer
              const oneYearFromNow = new Date();
              oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

              const rewardId = await ctx.db.insert('referralRewards', {
                referrerUserId: referrer._id,
                rewardType: 'self_subscription',
                referralIds,
                createdAt: now,
              });

              const subscriptionId = await ctx.db.insert('subscriptions', {
                userId: referrer._id,
                tier: 'pro',
                status: 'active',
                stripeCustomerId: `referral-reward-${rewardId}`,
                stripeSubscriptionId: `referral-reward-${rewardId}-${Date.now()}`,
                stripePriceId: 'referral-pro',
                currentPeriodStart: now,
                currentPeriodEnd: oneYearFromNow.toISOString(),
                cancelAtPeriodEnd: false,
                applicationsUsed: 0,
                applicationsLimit: 5,
                isReferralReward: true,
                referralRewardId: rewardId,
                createdAt: now,
                updatedAt: now,
              });

              await ctx.db.patch(rewardId, { subscriptionId });
            } else {
              // Referrer already subscribed — generate a coupon
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
              let random = '';
              for (let i = 0; i < 8; i++) {
                random += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              const couponCode = `RFCOUP-${random}`;

              await ctx.db.insert('referralRewards', {
                referrerUserId: referrer._id,
                rewardType: 'coupon',
                couponCode,
                couponStatus: 'available',
                referralIds,
                createdAt: now,
              });
            }

            // Mark referrals as rewarded
            for (const id of referralIds) {
              await ctx.db.patch(id, { status: 'rewarded' as const });
            }
          }
        }
      }
    }

    // Handle partner code — link student to partner if valid code provided
    if (args.partnerCode) {
      const code = args.partnerCode.trim().toUpperCase();
      const partnerProfile = await ctx.db
        .query('partnerProfiles')
        .withIndex('by_partner_code', (q) => q.eq('partnerCode', code))
        .first();

      if (partnerProfile && partnerProfile.approvalStatus === 'approved') {
        // Ensure this student isn't already linked to a partner
        const existingPartnerReferral = await ctx.db
          .query('partnerReferrals')
          .withIndex('by_student', (q) => q.eq('studentUserId', userId))
          .first();

        if (!existingPartnerReferral) {
          await ctx.db.insert('partnerReferrals', {
            partnerProfileId: partnerProfile._id,
            partnerUserId: partnerProfile.userId,
            studentUserId: userId,
            partnerCode: code,
            createdAt: now,
          });
        }
      }
    }

    return userId;
  },
});

export const verifyEmail = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_verification_token', (q) =>
        q.eq('verificationToken', args.token)
      )
      .first();

    if (!user) {
      throw new Error('Invalid verification token');
    }

    if (user.tokenExpiry && Date.now() > user.tokenExpiry) {
      throw new Error('Verification token has expired. Please request a new one.');
    }

    await ctx.db.patch(user._id, {
      emailVerified: true,
      verificationToken: undefined,
      tokenExpiry: undefined,
      updatedAt: new Date().toISOString(),
    });

    return { userId: user._id, email: user.email };
  },
});

export const updateVerificationToken = mutation({
  args: {
    userId: v.id('users'),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    await ctx.db.patch(args.userId, {
      verificationToken: args.token,
      tokenExpiry,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const markProfileCompleted = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      profileCompleted: true,
      updatedAt: new Date().toISOString(),
    });
  },
});
