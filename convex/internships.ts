import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    type: v.union(v.literal('full-time'), v.literal('part-time'), v.literal('remote')),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
    salaryRange: v.optional(v.string()),
    duration: v.optional(v.string()),
    deadline: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email!))
      .first();

    if (!user || user.role !== 'corporate') {
      throw new Error('Only corporate users can create internships');
    }

    const profile = await ctx.db
      .query('institutionProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .first();

    if (!profile || profile.approvalStatus !== 'approved') {
      throw new Error('Your corporate account must be approved before creating internships');
    }

    const now = new Date().toISOString();
    const internshipId = await ctx.db.insert('internships', {
      companyId: profile._id,
      title: args.title,
      description: args.description,
      location: args.location,
      type: args.type,
      requirements: args.requirements,
      responsibilities: args.responsibilities,
      salaryRange: args.salaryRange,
      duration: args.duration,
      deadline: args.deadline,
      status: 'draft',
      paymentStatus: 'unpaid',
      listingPrice: 15, // RM15 per listing
      createdAt: now,
      updatedAt: now,
    });

    return internshipId;
  },
});

export const getByCompany = query({
  args: { companyId: v.id('institutionProfiles') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('internships')
      .withIndex('by_company', (q) => q.eq('companyId', args.companyId))
      .order('desc')
      .collect();
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const internships = await ctx.db
      .query('internships')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .order('desc')
      .collect();

    const identity = await ctx.auth.getUserIdentity();
    
    // Anonymize company if not logged in
    const results = await Promise.all(
      internships.map(async (internship) => {
        const company = await ctx.db.get(internship.companyId);
        if (!identity) {
          return {
            ...internship,
            companyName: 'Private Company',
            logoUrl: null,
          };
        }
        return {
          ...internship,
          companyName: company?.institutionName || 'Unknown Company',
          logoUrl: company?.logoUrl || null,
        };
      })
    );

    return results;
  },
});

export const getById = query({
  args: { id: v.id('internships') },
  handler: async (ctx, args) => {
    const internship = await ctx.db.get(args.id);
    if (!internship) return null;

    const company = await ctx.db.get(internship.companyId);
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return {
        ...internship,
        companyName: 'Private Company',
        logoUrl: null,
      };
    }

    return {
      ...internship,
      companyName: company?.institutionName || 'Unknown Company',
      logoUrl: company?.logoUrl || null,
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('internships'),
    status: v.union(
      v.literal('draft'),
      v.literal('pending_payment'),
      v.literal('active'),
      v.literal('closed')
    ),
  },
  handler: async (ctx, args) => {
    const internship = await ctx.db.get(args.id);
    if (!internship) throw new Error('Internship not found');

    // Add auth checks here if needed
    
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });
  },
});
