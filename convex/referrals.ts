import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

const REFERRALS_PER_REWARD = 5;

// ─── Queries ────────────────────────────────────────────────

export const getReferralStats = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const referrals = await ctx.db
      .query('referrals')
      .withIndex('by_referrer', (q) => q.eq('referrerUserId', args.userId))
      .collect();

    const rewards = await ctx.db
      .query('referralRewards')
      .withIndex('by_referrer', (q) => q.eq('referrerUserId', args.userId))
      .collect();

    const totalReferrals = referrals.length;
    const rewardsEarned = rewards.length;
    const referralsTowardNextReward = totalReferrals % REFERRALS_PER_REWARD;

    return {
      referralCode: user.referralCode ?? null,
      totalReferrals,
      referralsTowardNextReward,
      referralsNeeded: REFERRALS_PER_REWARD - referralsTowardNextReward,
      rewardsEarned,
      rewards: rewards.map((r) => ({
        _id: r._id,
        rewardType: r.rewardType,
        couponCode: r.couponCode,
        couponStatus: r.couponStatus,
        createdAt: r.createdAt,
      })),
    };
  },
});

export const getReferralDetails = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const referrals = await ctx.db
      .query('referrals')
      .withIndex('by_referrer', (q) => q.eq('referrerUserId', args.userId))
      .collect();

    const enriched = await Promise.all(
      referrals.map(async (ref) => {
        const referredUser = await ctx.db.get(ref.referredUserId);
        return {
          _id: ref._id,
          referredName: referredUser?.fullName ?? 'Unknown',
          status: ref.status,
          createdAt: ref.createdAt,
        };
      })
    );

    return enriched.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});

export const validateReferralCode = query({
  args: { referralCode: v.string() },
  handler: async (ctx, args) => {
    const code = args.referralCode.trim().toUpperCase();

    const user = await ctx.db
      .query('users')
      .withIndex('by_referral_code', (q) => q.eq('referralCode', code))
      .first();

    if (!user) {
      return { valid: false, referrerName: '' };
    }

    return { valid: true, referrerName: user.fullName };
  },
});

export const validateReferralCoupon = query({
  args: { couponCode: v.string() },
  handler: async (ctx, args) => {
    const code = args.couponCode.trim().toUpperCase();

    const reward = await ctx.db
      .query('referralRewards')
      .withIndex('by_coupon_code', (q) => q.eq('couponCode', code))
      .first();

    if (!reward || reward.couponStatus !== 'available') {
      return { valid: false, referrerName: '' };
    }

    const referrer = await ctx.db.get(reward.referrerUserId);

    return {
      valid: true,
      referrerName: referrer?.fullName ?? 'A friend',
    };
  },
});

export const getUserReferralCoupons = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const rewards = await ctx.db
      .query('referralRewards')
      .withIndex('by_referrer', (q) => q.eq('referrerUserId', args.userId))
      .collect();

    const coupons = rewards.filter((r) => r.rewardType === 'coupon');

    const enriched = await Promise.all(
      coupons.map(async (c) => {
        let claimedByName: string | null = null;
        if (c.couponClaimedBy) {
          const claimedUser = await ctx.db.get(c.couponClaimedBy);
          claimedByName = claimedUser?.fullName ?? 'Unknown';
        }
        return {
          _id: c._id,
          couponCode: c.couponCode!,
          couponStatus: c.couponStatus!,
          claimedByName,
          couponClaimedAt: c.couponClaimedAt,
          createdAt: c.createdAt,
        };
      })
    );

    return enriched.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});

// ─── Mutations ──────────────────────────────────────────────

export const generateReferralCode = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');

    // If user already has a referral code, return it
    if (user.referralCode) return user.referralCode;

    // Generate a unique code
    let code: string;
    let isUnique = false;

    do {
      // Generate 8 random hex characters
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let random = '';
      for (let i = 0; i < 8; i++) {
        random += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code = `REF-${random}`;

      const existing = await ctx.db
        .query('users')
        .withIndex('by_referral_code', (q) => q.eq('referralCode', code))
        .first();

      isUnique = !existing;
    } while (!isUnique);

    await ctx.db.patch(args.userId, {
      referralCode: code,
      updatedAt: new Date().toISOString(),
    });

    return code;
  },
});

export const createReferral = mutation({
  args: {
    referrerUserId: v.id('users'),
    referredUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // 1. Prevent self-referral
    if (args.referrerUserId === args.referredUserId) {
      throw new Error('Cannot refer yourself');
    }

    // 2. Check both users exist
    const referrer = await ctx.db.get(args.referrerUserId);
    const referred = await ctx.db.get(args.referredUserId);
    if (!referrer || !referred) {
      throw new Error('User not found');
    }

    // 3. Check no duplicate referral for this referred user
    const existing = await ctx.db
      .query('referrals')
      .withIndex('by_referred', (q) => q.eq('referredUserId', args.referredUserId))
      .first();

    if (existing) {
      // This user was already referred — silently skip
      return null;
    }

    const now = new Date().toISOString();

    // 4. Create referral record
    const referralId = await ctx.db.insert('referrals', {
      referrerUserId: args.referrerUserId,
      referredUserId: args.referredUserId,
      status: 'registered',
      createdAt: now,
    });

    // 5. Count total referrals for the referrer
    const allReferrals = await ctx.db
      .query('referrals')
      .withIndex('by_referrer', (q) => q.eq('referrerUserId', args.referrerUserId))
      .collect();

    const totalCount = allReferrals.length;

    // 6. Check if this triggers a reward (every 5th referral)
    if (totalCount % REFERRALS_PER_REWARD === 0) {
      // Get the 5 unrewarded referrals
      const unrewarded = allReferrals
        .filter((r) => r.status === 'registered')
        .slice(0, REFERRALS_PER_REWARD);

      const referralIds = unrewarded.map((r) => r._id);

      // Check if referrer has an active subscription
      const subscriptions = await ctx.db
        .query('subscriptions')
        .withIndex('by_user_id', (q) => q.eq('userId', args.referrerUserId))
        .collect();

      const activeSubscription = subscriptions.find((s) => s.status === 'active');

      if (!activeSubscription) {
        // No active subscription — create one for the referrer
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        const rewardId = await ctx.db.insert('referralRewards', {
          referrerUserId: args.referrerUserId,
          rewardType: 'self_subscription',
          referralIds,
          createdAt: now,
        });

        const subscriptionId = await ctx.db.insert('subscriptions', {
          userId: args.referrerUserId,
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

        // Link subscription to the reward
        await ctx.db.patch(rewardId, { subscriptionId });
      } else {
        // Already has subscription — generate a coupon
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let random = '';
        for (let i = 0; i < 8; i++) {
          random += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const couponCode = `RFCOUP-${random}`;

        await ctx.db.insert('referralRewards', {
          referrerUserId: args.referrerUserId,
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

    return referralId;
  },
});

export const claimReferralCoupon = mutation({
  args: {
    couponCode: v.string(),
    claimingUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const code = args.couponCode.trim().toUpperCase();
    const now = new Date().toISOString();

    // 1. Look up the reward
    const reward = await ctx.db
      .query('referralRewards')
      .withIndex('by_coupon_code', (q) => q.eq('couponCode', code))
      .first();

    if (!reward || reward.couponStatus !== 'available') {
      throw new Error('Invalid or already claimed coupon code');
    }

    // 2. Check claiming user exists and is a student
    const user = await ctx.db.get(args.claimingUserId);
    if (!user || user.role !== 'student') {
      throw new Error('Only student accounts can claim referral coupons');
    }

    // 3. Prevent claiming own coupon
    if (reward.referrerUserId === args.claimingUserId) {
      throw new Error('You cannot claim your own referral coupon');
    }

    // 4. Check claiming user has no active subscription
    const existingSubs = await ctx.db
      .query('subscriptions')
      .withIndex('by_user_id', (q) => q.eq('userId', args.claimingUserId))
      .collect();

    const activeSub = existingSubs.find((s) => s.status === 'active');
    if (activeSub) {
      throw new Error('You already have an active subscription');
    }

    // 5. Create subscription for the claiming user
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const subscriptionId = await ctx.db.insert('subscriptions', {
      userId: args.claimingUserId,
      tier: 'pro',
      status: 'active',
      stripeCustomerId: `referral-coupon-${reward._id}`,
      stripeSubscriptionId: `referral-coupon-${reward._id}-${Date.now()}`,
      stripePriceId: 'referral-pro',
      currentPeriodStart: now,
      currentPeriodEnd: oneYearFromNow.toISOString(),
      cancelAtPeriodEnd: false,
      applicationsUsed: 0,
      applicationsLimit: 5,
      isReferralReward: true,
      referralRewardId: reward._id,
      createdAt: now,
      updatedAt: now,
    });

    // 6. Mark coupon as claimed
    await ctx.db.patch(reward._id, {
      couponStatus: 'claimed',
      couponClaimedBy: args.claimingUserId,
      couponClaimedAt: now,
      subscriptionId,
    });

    return subscriptionId;
  },
});
