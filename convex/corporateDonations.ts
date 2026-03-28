import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// ─── Queries ────────────────────────────────────────────────

export const getDonationsByCompany = query({
  args: { companyId: v.id('institutionProfiles') },
  handler: async (ctx, args) => {
    const donations = await ctx.db
      .query('corporateDonations')
      .withIndex('by_company', (q) => q.eq('companyId', args.companyId))
      .collect();

    return donations.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});

export const getDonationByCouponCode = query({
  args: { couponCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('corporateDonations')
      .withIndex('by_coupon_code', (q) => q.eq('couponCode', args.couponCode))
      .first();
  },
});

export const getDonationStats = query({
  args: { corporateUserId: v.id('users') },
  handler: async (ctx, args) => {
    const donations = await ctx.db
      .query('corporateDonations')
      .withIndex('by_corporate_user', (q) =>
        q.eq('corporateUserId', args.corporateUserId)
      )
      .collect();

    return {
      totalDonated: donations.reduce((sum, d) => sum + d.quantityPurchased, 0),
      totalAssigned: donations.reduce((sum, d) => sum + d.quantityAssigned, 0),
      totalRemaining: donations.reduce((sum, d) => sum + d.quantityRemaining, 0),
      totalAmountSpent: donations.reduce((sum, d) => sum + d.totalAmountPaid, 0),
      donationCount: donations.length,
    };
  },
});

export const getBeneficiaries = query({
  args: { donationId: v.id('corporateDonations') },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query('donatedSubscriptions')
      .withIndex('by_donation', (q) => q.eq('donationId', args.donationId))
      .collect();

    const enriched = await Promise.all(
      records.map(async (record) => {
        const student = await ctx.db.get(record.studentUserId);
        return {
          ...record,
          studentName: student?.fullName ?? 'Unknown',
          studentEmail: student?.email ?? 'Unknown',
        };
      })
    );

    return enriched.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});

export const getAllBeneficiaries = query({
  args: { corporateUserId: v.id('users') },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query('donatedSubscriptions')
      .withIndex('by_corporate_user', (q) =>
        q.eq('corporateUserId', args.corporateUserId)
      )
      .collect();

    const enriched = await Promise.all(
      records.map(async (record) => {
        const student = await ctx.db.get(record.studentUserId);
        return {
          ...record,
          studentName: student?.fullName ?? 'Unknown',
          studentEmail: student?.email ?? 'Unknown',
        };
      })
    );

    return enriched.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
});

export const validateCouponCode = query({
  args: { couponCode: v.string() },
  handler: async (ctx, args) => {
    const donation = await ctx.db
      .query('corporateDonations')
      .withIndex('by_coupon_code', (q) => q.eq('couponCode', args.couponCode))
      .first();

    if (!donation || donation.status === 'exhausted' || donation.quantityRemaining <= 0) {
      return { valid: false, companyName: '', tier: '', remainingSlots: 0 };
    }

    const profile = await ctx.db
      .query('institutionProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', donation.corporateUserId))
      .first();

    return {
      valid: true,
      companyName: profile?.institutionName ?? 'A generous sponsor',
      tier: donation.tier,
      remainingSlots: donation.quantityRemaining,
    };
  },
});

export const getDonationById = query({
  args: { donationId: v.id('corporateDonations') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.donationId);
  },
});

export const getUnsubscribedStudents = query({
  args: {},
  handler: async (ctx) => {
    // Get all students
    const allUsers = await ctx.db.query('users').collect();
    const students = allUsers.filter((u) => u.role === 'student');

    // Filter to those without active subscriptions
    const unsubscribed = [];
    for (const student of students) {
      const subs = await ctx.db
        .query('subscriptions')
        .withIndex('by_user_id', (q) => q.eq('userId', student._id))
        .collect();

      const hasActive = subs.some((s) => s.status === 'active');
      if (!hasActive) {
        unsubscribed.push(student);
      }
    }

    return unsubscribed;
  },
});

export const getCompanyProfile = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('institutionProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();
  },
});

export const getDonationByCheckoutSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const donations = await ctx.db.query('corporateDonations').collect();
    return donations.find((d) => d.stripeCheckoutSessionId === args.sessionId) ?? null;
  },
});

// ─── Mutations ──────────────────────────────────────────────

export const createDonation = mutation({
  args: {
    corporateUserId: v.id('users'),
    companyId: v.id('institutionProfiles'),
    tier: v.union(v.literal('pro'), v.literal('expert')),
    quantityPurchased: v.number(),
    totalAmountPaid: v.number(),
    currency: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    stripeCheckoutSessionId: v.optional(v.string()),
    couponCode: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    return await ctx.db.insert('corporateDonations', {
      corporateUserId: args.corporateUserId,
      companyId: args.companyId,
      tier: args.tier,
      quantityPurchased: args.quantityPurchased,
      quantityAssigned: 0,
      quantityRemaining: args.quantityPurchased,
      totalAmountPaid: args.totalAmountPaid,
      currency: args.currency,
      stripePaymentIntentId: args.stripePaymentIntentId,
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      couponCode: args.couponCode,
      status: 'completed',
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const assignDonationToStudent = mutation({
  args: {
    donationId: v.id('corporateDonations'),
    studentUserId: v.id('users'),
    claimMethod: v.union(v.literal('auto_assigned'), v.literal('coupon_claimed')),
    couponCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    // 1. Get donation and verify remaining balance
    const donation = await ctx.db.get(args.donationId);
    if (!donation || donation.quantityRemaining <= 0) {
      throw new Error('No remaining donations available');
    }

    // 2. Check student doesn't already have an active subscription
    const existingSubs = await ctx.db
      .query('subscriptions')
      .withIndex('by_user_id', (q) => q.eq('userId', args.studentUserId))
      .collect();

    const activeSub = existingSubs.find((s) => s.status === 'active');
    if (activeSub) {
      throw new Error('Student already has an active subscription');
    }

    // 3. Create subscription record for the student
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const tierConfig = donation.tier === 'pro'
      ? { applicationsLimit: 5 }
      : { applicationsLimit: 20 };

    const subscriptionId = await ctx.db.insert('subscriptions', {
      userId: args.studentUserId,
      tier: donation.tier,
      status: 'active',
      stripeCustomerId: `donated-${args.donationId}`,
      stripeSubscriptionId: `donated-${args.donationId}-${Date.now()}`,
      stripePriceId: `donated-${donation.tier}`,
      currentPeriodStart: now,
      currentPeriodEnd: oneYearFromNow.toISOString(),
      cancelAtPeriodEnd: false,
      applicationsUsed: 0,
      applicationsLimit: tierConfig.applicationsLimit,
      isDonated: true,
      donatedBy: donation.corporateUserId,
      donationId: args.donationId,
      createdAt: now,
      updatedAt: now,
    });

    // 4. Insert donated subscription tracking record
    await ctx.db.insert('donatedSubscriptions', {
      donationId: args.donationId,
      corporateUserId: donation.corporateUserId,
      studentUserId: args.studentUserId,
      subscriptionId,
      claimMethod: args.claimMethod,
      couponCode: args.couponCode,
      createdAt: now,
    });

    // 5. Update donation counters
    const newRemaining = donation.quantityRemaining - 1;
    await ctx.db.patch(args.donationId, {
      quantityAssigned: donation.quantityAssigned + 1,
      quantityRemaining: newRemaining,
      status: newRemaining <= 0 ? 'exhausted' : 'completed',
      updatedAt: now,
    });

    return subscriptionId;
  },
});
