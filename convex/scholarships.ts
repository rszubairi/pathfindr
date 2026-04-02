import { query, mutation, internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

// Get all scholarships with optional filters
export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal('active'), v.literal('closed'), v.literal('pending'))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let scholarshipsQuery = ctx.db.query('scholarships');

    if (args.status) {
      scholarshipsQuery = scholarshipsQuery.filter((q) =>
        q.eq(q.field('status'), args.status)
      );
    }

    const scholarships = await scholarshipsQuery.collect();

    const now = new Date().toISOString();
    
    // Sort so featured and unexpired are first
    const sortedScholarships = scholarships.sort((a, b) => {
      const aFeatured = a.isFeatured && a.featuredUntil && a.featuredUntil > now;
      const bFeatured = b.isFeatured && b.featuredUntil && b.featuredUntil > now;
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      return 0;
    });

    if (args.limit) {
      return sortedScholarships.slice(0, args.limit);
    }

    return sortedScholarships;
  },
});

// Get a single scholarship by ID
export const getById = query({
  args: { id: v.id('scholarships') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Search scholarships by name or provider
export const search = query({
  args: {
    searchQuery: v.string(),
    status: v.optional(
      v.union(v.literal('active'), v.literal('closed'), v.literal('pending'))
    ),
  },
  handler: async (ctx, args) => {
    if (!args.searchQuery) {
      // If no search query, return all scholarships
      let query = ctx.db.query('scholarships');
      if (args.status) {
        query = query.filter((q) => q.eq(q.field('status'), args.status));
      }
      return await query.collect();
    }

    // Search by name
    const nameResults = await ctx.db
      .query('scholarships')
      .withSearchIndex('search_name', (q) =>
        args.status
          ? q.search('name', args.searchQuery).eq('status', args.status)
          : q.search('name', args.searchQuery)
      )
      .collect();

    // Search by provider
    const providerResults = await ctx.db
      .query('scholarships')
      .withSearchIndex('search_provider', (q) =>
        args.status
          ? q.search('provider', args.searchQuery).eq('status', args.status)
          : q.search('provider', args.searchQuery)
      )
      .collect();

    // Combine and deduplicate results
    const combinedResults = [...nameResults, ...providerResults];
    const uniqueResults = Array.from(
      new Map(combinedResults.map((item) => [item._id, item])).values()
    );

    const now = new Date().toISOString();
    
    // Sort so featured and unexpired are first
    return uniqueResults.sort((a, b) => {
      const aFeatured = a.isFeatured && a.featuredUntil && a.featuredUntil > now;
      const bFeatured = b.isFeatured && b.featuredUntil && b.featuredUntil > now;
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      return 0;
    });
  },
});

// Filter scholarships by multiple criteria
export const filter = query({
  args: {
    countries: v.optional(v.array(v.string())),
    fields: v.optional(v.array(v.string())),
    providerTypes: v.optional(v.array(v.string())),
    minValue: v.optional(v.number()),
    maxValue: v.optional(v.number()),
    deadlineWithinMonths: v.optional(v.number()),
    status: v.optional(
      v.union(v.literal('active'), v.literal('closed'), v.literal('pending'))
    ),
  },
  handler: async (ctx, args) => {
    let scholarships = await ctx.db.query('scholarships').collect();

    // Filter by status
    if (args.status) {
      scholarships = scholarships.filter((s) => s.status === args.status);
    }

    // Filter by countries
    if (args.countries && args.countries.length > 0) {
      scholarships = scholarships.filter((s) =>
        args.countries!.some((country) => s.eligibleCountries.includes(country))
      );
    }

    // Filter by fields
    if (args.fields && args.fields.length > 0) {
      scholarships = scholarships.filter((s) =>
        args.fields!.some((field) => s.eligibleFields.includes(field))
      );
    }

    // Filter by provider types
    if (args.providerTypes && args.providerTypes.length > 0) {
      scholarships = scholarships.filter((s) =>
        args.providerTypes!.includes(s.providerType)
      );
    }

    // Filter by value range
    if (args.minValue !== undefined) {
      scholarships = scholarships.filter((s) => s.value >= args.minValue!);
    }
    if (args.maxValue !== undefined) {
      scholarships = scholarships.filter((s) => s.value <= args.maxValue!);
    }

    // Filter by deadline
    if (args.deadlineWithinMonths !== undefined) {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setMonth(now.getMonth() + args.deadlineWithinMonths);

      scholarships = scholarships.filter((s) => {
        const deadline = new Date(s.deadline);
        return deadline >= now && deadline <= futureDate;
      });
    }

    const now = new Date().toISOString();

    // Sort so featured and unexpired are first
    return scholarships.sort((a, b) => {
      const aFeatured = a.isFeatured && a.featuredUntil && a.featuredUntil > now;
      const bFeatured = b.isFeatured && b.featuredUntil && b.featuredUntil > now;
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      return 0;
    });
  },
});

// Get scholarship statistics
export const stats = query({
  handler: async (ctx) => {
    const scholarships = await ctx.db.query('scholarships').collect();

    const totalScholarships = scholarships.length;
    const activeScholarships = scholarships.filter((s) => s.status === 'active').length;

    // Get unique countries
    const countries = new Set<string>();
    scholarships.forEach((s) => s.eligibleCountries.forEach((c) => countries.add(c)));

    // Get unique fields and provider types
    const fields = new Set<string>();
    const providerTypes = new Set<string>();
    scholarships.forEach((s) => {
      s.eligibleFields.forEach((f) => fields.add(f));
      providerTypes.add(s.providerType);
    });

    // Calculate total value
    const totalValue = scholarships.reduce((sum, s) => sum + s.value, 0);

    return {
      totalScholarships,
      activeScholarships,
      totalCountries: countries.size,
      totalValue,
      availableValues: {
        countries: Array.from(countries).sort(),
        fields: Array.from(fields).sort(),
        providerTypes: Array.from(providerTypes).sort(),
      },
    };
  },
});

// Create a new scholarship
export const create = mutation({
  args: {
    name: v.string(),
    provider: v.string(),
    providerType: v.union(
      v.literal('government'),
      v.literal('university'),
      v.literal('corporate'),
      v.literal('ngo'),
      v.literal('foundation'),
      v.literal('individual')
    ),
    value: v.number(),
    currency: v.string(),
    eligibleFields: v.array(v.string()),
    eligibleCountries: v.array(v.string()),
    deadline: v.string(),
    eligibilityCriteria: v.any(),
    status: v.optional(
      v.union(v.literal('active'), v.literal('closed'), v.literal('pending'))
    ),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    const scholarshipId = await ctx.db.insert('scholarships', {
      ...args,
      status: args.status || 'active',
      createdAt: now,
      updatedAt: now,
    });

    return scholarshipId;
  },
});

// Update a scholarship
export const update = mutation({
  args: {
    id: v.id('scholarships'),
    name: v.optional(v.string()),
    provider: v.optional(v.string()),
    providerType: v.optional(
      v.union(
        v.literal('government'),
        v.literal('university'),
        v.literal('corporate'),
        v.literal('ngo'),
        v.literal('foundation'),
        v.literal('individual')
      )
    ),
    value: v.optional(v.number()),
    currency: v.optional(v.string()),
    eligibleFields: v.optional(v.array(v.string())),
    eligibleCountries: v.optional(v.array(v.string())),
    deadline: v.optional(v.string()),
    eligibilityCriteria: v.optional(v.any()),
    status: v.optional(
      v.union(v.literal('active'), v.literal('closed'), v.literal('pending'))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Check if status is changing from pending to active
    const existing = await ctx.db.get(id);
    const wasStatusPending = existing?.status === 'pending';
    const isNowActive = updates.status === 'active';

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    // Trigger notification emails when scholarship goes from pending -> active
    if (wasStatusPending && isNowActive) {
      await ctx.scheduler.runAfter(0, api.notificationActions.sendScholarshipOpenNotifications, {
        scholarshipId: id,
      });
    }

    return id;
  },
});

// Increment application count when a user clicks "Apply Now"
export const incrementApplicationCount = mutation({
  args: { id: v.id('scholarships') },
  handler: async (ctx, args) => {
    const scholarship = await ctx.db.get(args.id);
    if (!scholarship) throw new Error('Scholarship not found');

    const currentCount = scholarship.applicationCount ?? 0;
    await ctx.db.patch(args.id, {
      applicationCount: currentCount + 1,
      updatedAt: new Date().toISOString(),
    });

    return currentCount + 1;
  },
});

// Delete a scholarship
export const remove = mutation({
  args: { id: v.id('scholarships') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// [DEV] Set first N active scholarships to pending status for testing
export const setScholarshipsPending = mutation({
  args: { count: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const count = args.count ?? 2;
    const activeScholarships = await ctx.db
      .query('scholarships')
      .filter((q) => q.eq(q.field('status'), 'active'))
      .take(count);

    const ids = [];
    for (const s of activeScholarships) {
      await ctx.db.patch(s._id, {
        status: 'pending' as const,
        updatedAt: new Date().toISOString(),
      });
      ids.push(s._id);
    }
    return ids;
  },
});

// Bulk create scholarships (for seeding)
export const bulkCreate = mutation({
  args: {
    scholarships: v.array(
      v.object({
        name: v.string(),
        provider: v.string(),
        providerType: v.union(
          v.literal('government'),
          v.literal('university'),
          v.literal('corporate'),
          v.literal('ngo'),
          v.literal('foundation'),
          v.literal('individual')
        ),
        value: v.number(),
        currency: v.string(),
        eligibleFields: v.array(v.string()),
        eligibleCountries: v.array(v.string()),
        deadline: v.string(),
        eligibilityCriteria: v.any(),
        matchScore: v.optional(v.number()),
        status: v.union(v.literal('active'), v.literal('closed'), v.literal('pending')),
        createdAt: v.string(),
        updatedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const scholarship of args.scholarships) {
      const id = await ctx.db.insert('scholarships', scholarship);
      ids.push(id);
    }
    return ids;
  },
});

// Internal mutation to expire featured status for scholarships
export const expireFeatured = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const scholarships = await ctx.db
      .query('scholarships')
      .withIndex('by_featured', (q) => q.eq('isFeatured', true))
      .collect();

    let expired = 0;
    for (const scholarship of scholarships) {
      if (scholarship.featuredUntil && scholarship.featuredUntil < now) {
        await ctx.db.patch(scholarship._id, {
          isFeatured: false,
          featuredUntil: undefined,
        });
        expired++;
      }
    }
    return expired;
  },
});
