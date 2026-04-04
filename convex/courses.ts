import { v } from 'convex/values';
import { query } from './_generated/server';

export const getCourseCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('courseCategories')
      .withIndex('by_active', (q) => q.eq('isActive', true))
      .order('asc')
      .collect();
  },
});

export const getCourses = query({
  args: {
    categoryId: v.optional(v.id('courseCategories')),
    minAge: v.optional(v.number()),
    maxAge: v.optional(v.number()),
    difficulty: v.optional(v.union(v.literal('beginner'), v.literal('intermediate'), v.literal('advanced'))),
    searchTerm: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let coursesQuery = ctx.db
      .query('courses')
      .withIndex('by_status', (q) => q.eq('status', 'published'));

    if (args.categoryId) {
      coursesQuery = ctx.db
        .query('courses')
        .withIndex('by_category', (q) => q.eq('categoryId', args.categoryId!));
    }

    let courses = await coursesQuery.collect();

    // Secondary filtering
    if (args.minAge !== undefined) {
      courses = courses.filter((c) => c.ageRange.min >= args.minAge!);
    }
    if (args.maxAge !== undefined) {
      courses = courses.filter((c) => c.ageRange.max <= args.maxAge!);
    }
    if (args.difficulty) {
      courses = courses.filter((c) => c.difficulty === args.difficulty);
    }
    if (args.searchTerm) {
      const search = args.searchTerm.toLowerCase();
      courses = courses.filter((c) => c.title.toLowerCase().includes(search) || c.description.toLowerCase().includes(search));
    }

    return courses;
  },
});

export const getCourseById = query({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  },
});

export const getCourseLessons = query({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('lessons')
      .withIndex('by_sequence', (q) => q.eq('courseId', args.courseId))
      .collect();
  },
});
export const getPopularCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('courses')
      .withIndex('by_status', (q) => q.eq('status', 'published'))
      .order('desc')
      .take(4);
  },
});
