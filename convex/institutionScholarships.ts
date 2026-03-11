import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// List scholarships created by an institution
export const listByInstitution = query({
  args: {
    userId: v.id('users'),
    status: v.optional(
      v.union(v.literal('active'), v.literal('closed'), v.literal('pending'))
    ),
  },
  handler: async (ctx, args) => {
    let scholarships = await ctx.db
      .query('scholarships')
      .withIndex('by_created_by', (q) => q.eq('createdBy', args.userId))
      .collect();

    if (args.status) {
      scholarships = scholarships.filter((s) => s.status === args.status);
    }

    // Enrich with application counts
    const enriched = await Promise.all(
      scholarships.map(async (s) => {
        const applications = await ctx.db
          .query('applications')
          .withIndex('by_scholarship_id', (q) => q.eq('scholarshipId', s._id))
          .collect();
        return {
          ...s,
          applicationsCount: applications.length,
        };
      })
    );

    return enriched;
  },
});

// Create a scholarship for an institution
export const createForInstitution = mutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    value: v.number(),
    currency: v.string(),
    eligibleFields: v.array(v.string()),
    eligibleCountries: v.array(v.string()),
    deadline: v.string(),
    eligibilityCriteria: v.any(),
    description: v.optional(v.string()),
    applicationUrl: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal('active'), v.literal('closed'), v.literal('pending'))
    ),
  },
  handler: async (ctx, args) => {
    // Fetch institution profile for provider info
    const profile = await ctx.db
      .query('institutionProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();

    if (!profile) {
      throw new Error('Institution profile not found');
    }

    if (profile.approvalStatus !== 'approved') {
      throw new Error('Your institution must be approved to create scholarships');
    }

    const now = new Date().toISOString();
    const { userId, ...scholarshipFields } = args;

    const scholarshipId = await ctx.db.insert('scholarships', {
      ...scholarshipFields,
      provider: profile.institutionName,
      providerType: profile.providerType,
      createdBy: userId,
      status: args.status || 'pending',
      applicationCount: 0,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    return scholarshipId;
  },
});

// Update a scholarship (ownership check)
export const updateForInstitution = mutation({
  args: {
    userId: v.id('users'),
    id: v.id('scholarships'),
    name: v.optional(v.string()),
    value: v.optional(v.number()),
    currency: v.optional(v.string()),
    eligibleFields: v.optional(v.array(v.string())),
    eligibleCountries: v.optional(v.array(v.string())),
    deadline: v.optional(v.string()),
    eligibilityCriteria: v.optional(v.any()),
    description: v.optional(v.string()),
    applicationUrl: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal('active'), v.literal('closed'), v.literal('pending'))
    ),
  },
  handler: async (ctx, args) => {
    const scholarship = await ctx.db.get(args.id);
    if (!scholarship) throw new Error('Scholarship not found');
    if (scholarship.createdBy !== args.userId) {
      throw new Error('You can only edit your own scholarships');
    }

    const { userId, id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(id, {
      ...cleanUpdates,
      updatedAt: new Date().toISOString(),
    });

    return id;
  },
});

// Delete a scholarship (ownership check)
export const removeForInstitution = mutation({
  args: {
    userId: v.id('users'),
    id: v.id('scholarships'),
  },
  handler: async (ctx, args) => {
    const scholarship = await ctx.db.get(args.id);
    if (!scholarship) throw new Error('Scholarship not found');
    if (scholarship.createdBy !== args.userId) {
      throw new Error('You can only delete your own scholarships');
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Bulk update status (ownership check)
export const bulkUpdateStatus = mutation({
  args: {
    userId: v.id('users'),
    ids: v.array(v.id('scholarships')),
    status: v.union(v.literal('active'), v.literal('closed'), v.literal('pending')),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    for (const id of args.ids) {
      const scholarship = await ctx.db.get(id);
      if (!scholarship || scholarship.createdBy !== args.userId) continue;
      await ctx.db.patch(id, { status: args.status, updatedAt: now });
    }
    return args.ids.length;
  },
});

// Bulk delete (ownership check)
export const bulkRemove = mutation({
  args: {
    userId: v.id('users'),
    ids: v.array(v.id('scholarships')),
  },
  handler: async (ctx, args) => {
    let deleted = 0;
    for (const id of args.ids) {
      const scholarship = await ctx.db.get(id);
      if (!scholarship || scholarship.createdBy !== args.userId) continue;
      await ctx.db.delete(id);
      deleted++;
    }
    return deleted;
  },
});

// Get analytics for all institution scholarships
export const getScholarshipAnalytics = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const scholarships = await ctx.db
      .query('scholarships')
      .withIndex('by_created_by', (q) => q.eq('createdBy', args.userId))
      .collect();

    let totalViews = 0;
    let totalApplications = 0;

    const perScholarship = await Promise.all(
      scholarships.map(async (s) => {
        const applications = await ctx.db
          .query('applications')
          .withIndex('by_scholarship_id', (q) => q.eq('scholarshipId', s._id))
          .collect();

        const views = s.viewCount ?? 0;
        const appCount = applications.length;
        totalViews += views;
        totalApplications += appCount;

        return {
          _id: s._id,
          name: s.name,
          status: s.status,
          value: s.value,
          currency: s.currency,
          deadline: s.deadline,
          views,
          applications: appCount,
          conversionRate: views > 0 ? ((appCount / views) * 100).toFixed(1) : '0.0',
        };
      })
    );

    return {
      totalScholarships: scholarships.length,
      activeScholarships: scholarships.filter((s) => s.status === 'active').length,
      pendingScholarships: scholarships.filter((s) => s.status === 'pending').length,
      totalViews,
      totalApplications,
      perScholarship,
    };
  },
});

// Get applicants for a specific scholarship
export const getApplicants = query({
  args: {
    userId: v.id('users'),
    scholarshipId: v.id('scholarships'),
  },
  handler: async (ctx, args) => {
    // Verify ownership
    const scholarship = await ctx.db.get(args.scholarshipId);
    if (!scholarship || scholarship.createdBy !== args.userId) {
      throw new Error('Scholarship not found or access denied');
    }

    const applications = await ctx.db
      .query('applications')
      .withIndex('by_scholarship_id', (q) =>
        q.eq('scholarshipId', args.scholarshipId)
      )
      .collect();

    // Enrich with user info
    const applicants = await Promise.all(
      applications.map(async (app) => {
        const user = await ctx.db.get(app.userId);
        return {
          applicationId: app._id,
          userId: app.userId,
          fullName: user?.fullName ?? 'Unknown',
          email: user?.email ?? 'Unknown',
          status: app.status,
          appliedAt: app.appliedAt,
        };
      })
    );

    return applicants;
  },
});

// Update applicant status
export const updateApplicantStatus = mutation({
  args: {
    userId: v.id('users'),
    applicationId: v.id('applications'),
    status: v.union(
      v.literal('applied'),
      v.literal('under_review'),
      v.literal('shortlisted'),
      v.literal('rejected'),
      v.literal('awarded'),
      v.literal('withdrawn')
    ),
  },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error('Application not found');

    // Verify ownership of the scholarship
    const scholarship = await ctx.db.get(application.scholarshipId);
    if (!scholarship || scholarship.createdBy !== args.userId) {
      throw new Error('Access denied');
    }

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });

    return args.applicationId;
  },
});

// Increment view count (called from detail page)
export const incrementViewCount = mutation({
  args: { id: v.id('scholarships') },
  handler: async (ctx, args) => {
    const scholarship = await ctx.db.get(args.id);
    if (!scholarship) return;
    await ctx.db.patch(args.id, {
      viewCount: (scholarship.viewCount ?? 0) + 1,
    });
  },
});
