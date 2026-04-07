import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// ─── Queries ────────────────────────────────────────────────

export const getUserSubscription = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const subscriptions = await ctx.db
      .query('subscriptions')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    // Return the most recent active subscription
    return (
      subscriptions.find((s) => s.status === 'active') ??
      subscriptions.find((s) => s.status === 'past_due') ??
      null
    );
  },
});

export const hasUserApplied = query({
  args: {
    userId: v.id('users'),
    scholarshipId: v.id('scholarships'),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('applications')
      .withIndex('by_user_and_scholarship', (q) =>
        q.eq('userId', args.userId).eq('scholarshipId', args.scholarshipId)
      )
      .first();

    return !!existing;
  },
});

export const getUserApplications = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query('applications')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    // Enrich with scholarship data
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const scholarship = await ctx.db.get(app.scholarshipId);
        return {
          ...app,
          scholarshipName: scholarship?.name ?? 'Unknown',
          scholarshipProvider: scholarship?.provider ?? 'Unknown',
          scholarshipValue: scholarship?.value ?? 0,
          scholarshipCurrency: scholarship?.currency ?? 'USD',
        };
      })
    );

    return enriched.sort(
      (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
  },
});

// ─── Mutations ──────────────────────────────────────────────

export const createApplication = mutation({
  args: {
    userId: v.id('users'),
    scholarshipId: v.id('scholarships'),
  },
  handler: async (ctx, args) => {
    // 1. Check subscription
    const subscriptions = await ctx.db
      .query('subscriptions')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    const subscription = subscriptions.find((s) => s.status === 'active');
    if (!subscription) {
      throw new Error('Active subscription required to apply');
    }

    // 2. Check application limit
    if (subscription.applicationsUsed >= subscription.applicationsLimit) {
      throw new Error('Application limit reached for current subscription period');
    }

    // 3. Check not already applied
    const existing = await ctx.db
      .query('applications')
      .withIndex('by_user_and_scholarship', (q) =>
        q.eq('userId', args.userId).eq('scholarshipId', args.scholarshipId)
      )
      .first();

    if (existing) {
      throw new Error('Already applied to this scholarship');
    }

    // 4. Create application record
    const now = new Date().toISOString();
    const applicationId = await ctx.db.insert('applications', {
      userId: args.userId,
      scholarshipId: args.scholarshipId,
      status: 'applied',
      appliedAt: now,
      updatedAt: now,
    });

    // 5. Increment applicationsUsed on subscription
    await ctx.db.patch(subscription._id, {
      applicationsUsed: subscription.applicationsUsed + 1,
      updatedAt: now,
    });

    // 6. Increment applicationCount on scholarship
    const scholarship = await ctx.db.get(args.scholarshipId);
    if (scholarship) {
      await ctx.db.patch(args.scholarshipId, {
        applicationCount: (scholarship.applicationCount ?? 0) + 1,
      });
    }

    return applicationId;
  },
});

export const upsertSubscription = mutation({
  args: {
    userId: v.id('users'),
    tier: v.union(v.literal('pro'), v.literal('expert')),
    status: v.union(
      v.literal('active'),
      v.literal('canceled'),
      v.literal('past_due'),
      v.literal('incomplete')
    ),
    // These fields are provider-agnostic; they store Xendit IDs
    xenditCustomerId: v.string(),
    xenditSubscriptionId: v.string(),
    xenditPlanId: v.string(),
    currentPeriodStart: v.string(),
    currentPeriodEnd: v.string(),
    cancelAtPeriodEnd: v.boolean(),
    applicationsLimit: v.number(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    // Check if subscription already exists for this invoice/subscription ID
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_stripe_subscription_id', (q) =>
        q.eq('stripeSubscriptionId', args.xenditSubscriptionId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        tier: args.tier,
        status: args.status,
        stripePriceId: args.xenditPlanId,
        currentPeriodStart: args.currentPeriodStart,
        currentPeriodEnd: args.currentPeriodEnd,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
        applicationsLimit: args.applicationsLimit,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert('subscriptions', {
      userId: args.userId,
      tier: args.tier,
      status: args.status,
      stripeCustomerId: args.xenditCustomerId,
      stripeSubscriptionId: args.xenditSubscriptionId,
      stripePriceId: args.xenditPlanId,
      currentPeriodStart: args.currentPeriodStart,
      currentPeriodEnd: args.currentPeriodEnd,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      applicationsUsed: 0,
      applicationsLimit: args.applicationsLimit,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateSubscriptionStatus = mutation({
  args: {
    stripeSubscriptionId: v.string(),
    status: v.union(
      v.literal('active'),
      v.literal('canceled'),
      v.literal('past_due'),
      v.literal('incomplete')
    ),
    currentPeriodStart: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.string()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    tier: v.optional(v.union(v.literal('pro'), v.literal('expert'))),
    applicationsLimit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_stripe_subscription_id', (q) =>
        q.eq('stripeSubscriptionId', args.stripeSubscriptionId)
      )
      .first();

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const updates: Record<string, unknown> = {
      status: args.status,
      updatedAt: new Date().toISOString(),
    };

    if (args.currentPeriodStart) updates.currentPeriodStart = args.currentPeriodStart;
    if (args.currentPeriodEnd) updates.currentPeriodEnd = args.currentPeriodEnd;
    if (args.cancelAtPeriodEnd !== undefined) updates.cancelAtPeriodEnd = args.cancelAtPeriodEnd;
    if (args.tier) updates.tier = args.tier;
    if (args.applicationsLimit) updates.applicationsLimit = args.applicationsLimit;

    await ctx.db.patch(subscription._id, updates);
  },
});

export const resetApplicationCount = mutation({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_stripe_subscription_id', (q) =>
        q.eq('stripeSubscriptionId', args.stripeSubscriptionId)
      )
      .first();

    if (!subscription) return;

    await ctx.db.patch(subscription._id, {
      applicationsUsed: 0,
      updatedAt: new Date().toISOString(),
    });
  },
});
