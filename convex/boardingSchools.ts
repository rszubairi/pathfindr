import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// List all boarding schools with optional filters
export const list = query({
  args: {
    category: v.optional(v.string()),
    state: v.optional(v.string()),
    status: v.optional(v.string()),
    managedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const schools = args.status
      ? await ctx.db
          .query('boardingSchools')
          .withIndex('by_status', (q) => q.eq('status', args.status as 'active' | 'closed' | 'upcoming'))
          .collect()
      : await ctx.db.query('boardingSchools').collect();

    return schools.filter((school) => {
      if (args.category && school.category !== args.category) return false;
      if (args.state && school.state !== args.state) return false;
      if (args.managedBy && school.managedBy !== args.managedBy) return false;
      return true;
    });
  },
});

// Get a single boarding school by ID
export const getById = query({
  args: { id: v.id('boardingSchools') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Full-text search boarding schools by name
export const search = query({
  args: {
    searchQuery: v.string(),
    category: v.optional(v.string()),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('boardingSchools')
      .withSearchIndex('search_name', (q) => {
        const search = q.search('name', args.searchQuery);
        if (args.category && args.state) {
          return search
            .eq('category', args.category as 'SBP Premier' | 'SMS' | 'SBPI' | 'SMAP' | 'TMUA' | 'MRSM' | 'MRSM Premier')
            .eq('state', args.state);
        }
        if (args.category) {
          return search.eq('category', args.category as 'SBP Premier' | 'SMS' | 'SBPI' | 'SMAP' | 'TMUA' | 'MRSM' | 'MRSM Premier');
        }
        if (args.state) {
          return search.eq('state', args.state);
        }
        return search;
      })
      .collect();

    return results;
  },
});

// Advanced filter for boarding schools
export const filter = query({
  args: {
    states: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.string())),
    gender: v.optional(v.string()),
    entryLevel: v.optional(v.string()),
    managedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const schools = await ctx.db.query('boardingSchools').collect();

    return schools.filter((school) => {
      if (args.states && args.states.length > 0 && !args.states.includes(school.state)) return false;
      if (args.categories && args.categories.length > 0 && !args.categories.includes(school.category)) return false;
      if (args.gender && school.gender !== args.gender) return false;
      if (args.entryLevel && !school.entryLevels.includes(args.entryLevel)) return false;
      if (args.managedBy && school.managedBy !== args.managedBy) return false;
      return true;
    });
  },
});

// Get statistics about boarding schools
export const stats = query({
  handler: async (ctx) => {
    const schools = await ctx.db.query('boardingSchools').collect();

    const byCategory: Record<string, number> = {};
    const byState: Record<string, number> = {};
    const byManagedBy: Record<string, number> = {};

    for (const school of schools) {
      byCategory[school.category] = (byCategory[school.category] || 0) + 1;
      byState[school.state] = (byState[school.state] || 0) + 1;
      byManagedBy[school.managedBy] = (byManagedBy[school.managedBy] || 0) + 1;
    }

    return {
      total: schools.length,
      byCategory,
      byState,
      byManagedBy,
      states: [...new Set(schools.map((s) => s.state))].sort(),
      categories: [...new Set(schools.map((s) => s.category))].sort(),
    };
  },
});

// Create a single boarding school
export const create = mutation({
  args: {
    name: v.string(),
    shortName: v.optional(v.string()),
    category: v.union(
      v.literal('SBP Premier'),
      v.literal('SMS'),
      v.literal('SBPI'),
      v.literal('SMAP'),
      v.literal('TMUA'),
      v.literal('MRSM'),
      v.literal('MRSM Premier')
    ),
    state: v.string(),
    district: v.string(),
    gender: v.union(v.literal('male'), v.literal('female'), v.literal('mixed')),
    entryLevels: v.array(v.string()),
    applicationPortal: v.string(),
    applicationPeriod: v.string(),
    description: v.optional(v.string()),
    specialPrograms: v.array(v.string()),
    managedBy: v.union(v.literal('KPM'), v.literal('MARA')),
    status: v.union(v.literal('active'), v.literal('closed'), v.literal('upcoming')),
    deadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert('boardingSchools', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Bulk create boarding schools
export const bulkCreate = mutation({
  args: {
    schools: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const school of args.schools) {
      const id = await ctx.db.insert('boardingSchools', school);
      ids.push(id);
    }
    return { count: ids.length };
  },
});

// Update a boarding school
export const update = mutation({
  args: {
    id: v.id('boardingSchools'),
    name: v.optional(v.string()),
    shortName: v.optional(v.string()),
    status: v.optional(v.union(v.literal('active'), v.literal('closed'), v.literal('upcoming'))),
    deadline: v.optional(v.string()),
    applicationPeriod: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, { ...filtered, updatedAt: new Date().toISOString() });
  },
});

// Remove a boarding school
export const remove = mutation({
  args: { id: v.id('boardingSchools') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
