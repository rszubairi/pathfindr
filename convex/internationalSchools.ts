import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { INTERNATIONAL_SCHOOLS_SEED } from './internationalSchoolsSeed';

// List all international schools with optional filters
export const list = query({
  args: {
    country: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const schools = args.country
      ? await ctx.db
          .query('internationalSchools')
          .withIndex('by_country', (q) => q.eq('country', args.country!))
          .collect()
      : await ctx.db.query('internationalSchools').collect();

    if (args.status) {
      return schools.filter((s) => s.status === args.status);
    }
    return schools;
  },
});

// Get a single school by ID
export const getById = query({
  args: { id: v.id('internationalSchools') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Full-text search by name
export const search = query({
  args: {
    searchQuery: v.string(),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('internationalSchools')
      .withSearchIndex('search_name', (q) => {
        const search = q.search('name', args.searchQuery);
        if (args.country) {
          return search.eq('country', args.country);
        }
        return search;
      })
      .collect();
  },
});

// Advanced filter
export const filter = query({
  args: {
    countries: v.optional(v.array(v.string())),
    curriculums: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const schools = await ctx.db.query('internationalSchools').collect();

    return schools.filter((school) => {
      if (args.countries && args.countries.length > 0 && !args.countries.includes(school.country)) return false;
      if (args.curriculums && args.curriculums.length > 0) {
        const hasCurriculum = school.curriculum.some((c) => args.curriculums!.includes(c));
        if (!hasCurriculum) return false;
      }
      return true;
    });
  },
});

// Get statistics
export const stats = query({
  handler: async (ctx) => {
    const schools = await ctx.db.query('internationalSchools').collect();

    const byCountry: Record<string, number> = {};
    const byCurriculum: Record<string, number> = {};

    for (const school of schools) {
      byCountry[school.country] = (byCountry[school.country] || 0) + 1;
      for (const c of school.curriculum) {
        byCurriculum[c] = (byCurriculum[c] || 0) + 1;
      }
    }

    return {
      total: schools.length,
      byCountry,
      byCurriculum,
      countries: [...new Set(schools.map((s) => s.country))].sort(),
      curriculums: [...new Set(schools.flatMap((s) => s.curriculum))].sort(),
    };
  },
});

// Create a single school
export const create = mutation({
  args: {
    name: v.string(),
    country: v.string(),
    city: v.string(),
    curriculum: v.array(v.string()),
    grades: v.string(),
    annualFees: v.string(),
    website: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal('active'), v.literal('closed')),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert('internationalSchools', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Bulk create
export const bulkCreate = mutation({
  args: {
    schools: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const school of args.schools) {
      const id = await ctx.db.insert('internationalSchools', school);
      ids.push(id);
    }
    return { count: ids.length };
  },
});

// Seed data — inserts all 60 schools if the table is empty
export const seedData = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query('internationalSchools').first();
    if (existing) {
      return { message: 'Data already seeded', count: 0 };
    }

    const now = new Date().toISOString();
    let count = 0;
    for (const school of INTERNATIONAL_SCHOOLS_SEED) {
      await ctx.db.insert('internationalSchools', {
        ...school,
        createdAt: now,
        updatedAt: now,
      });
      count++;
    }
    return { message: 'Seed data inserted', count };
  },
});

// Reseed data — deletes all existing records and reinserts with latest seed data
export const reseedData = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query('internationalSchools').collect();
    for (const school of existing) {
      await ctx.db.delete(school._id);
    }

    const now = new Date().toISOString();
    let count = 0;
    for (const school of INTERNATIONAL_SCHOOLS_SEED) {
      await ctx.db.insert('internationalSchools', {
        ...school,
        createdAt: now,
        updatedAt: now,
      });
      count++;
    }
    return { message: 'Data reseeded', count };
  },
});
