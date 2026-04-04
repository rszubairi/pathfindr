import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const enrollInCourse = mutation({
  args: {
    userId: v.id('users'),
    courseId: v.id('courses'),
    kidProfileId: v.id('kidProfiles'),
  },
  handler: async (ctx, args) => {
    // Check if kid belongs to user
    const kid = await ctx.db.get(args.kidProfileId);
    if (!kid || kid.userId !== args.userId) {
      throw new Error('Invalid kid profile');
    }

    // Check if already enrolled
    const existingEnrollment = await ctx.db
      .query('courseEnrollments')
      .withIndex('by_kid_and_course', (q) => q.eq('kidProfileId', args.kidProfileId).eq('courseId', args.courseId))
      .unique();

    if (existingEnrollment) {
      return existingEnrollment._id;
    }

    const enrollmentId = await ctx.db.insert('courseEnrollments', {
      userId: args.userId,
      kidProfileId: args.kidProfileId,
      courseId: args.courseId,
      progress: 0,
      currentLessonIndex: 0,
      completedLessons: [],
      totalTimeSpent: 0,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    });

    return enrollmentId;
  },
});

export const getEnrollment = query({
  args: {
    courseId: v.id('courses'),
    kidProfileId: v.id('kidProfiles'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('courseEnrollments')
      .withIndex('by_kid_and_course', (q) => q.eq('kidProfileId', args.kidProfileId).eq('courseId', args.courseId))
      .unique();
  },
});

export const updateProgress = mutation({
  args: {
    userId: v.id('users'),
    enrollmentId: v.id('courseEnrollments'),
    lessonId: v.id('lessons'),
    score: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db.get(args.enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    if (enrollment.userId !== args.userId) {
      throw new Error('Unauthorized');
    }

    const completedLessons = [...enrollment.completedLessons];
    const lessonExists = completedLessons.find((l) => l.lessonId === args.lessonId);

    if (!lessonExists) {
      completedLessons.push({
        lessonId: args.lessonId,
        completedAt: new Date().toISOString(),
        score: args.score,
        revisionCount: 0,
      });
    }

    // Calculate progress
    const totalLessons = (await ctx.db
      .query('lessons')
      .withIndex('by_course', (q) => q.eq('courseId', enrollment.courseId))
      .collect()).length;

    const progress = Math.min(Math.round((completedLessons.length / totalLessons) * 100), 100);

    await ctx.db.patch(args.enrollmentId, {
      completedLessons,
      progress,
      lastAccessedAt: new Date().toISOString(),
      completedAt: progress === 100 ? new Date().toISOString() : enrollment.completedAt,
    });

    return args.enrollmentId;
  },
});

export const getKidEnrollments = query({
  args: { kidProfileId: v.id('kidProfiles') },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query('courseEnrollments')
      .withIndex('by_kid', (q) => q.eq('kidProfileId', args.kidProfileId))
      .collect();

    // Fetch course details for each enrollment
    const enrollmentDetails = await Promise.all(
      enrollments.map(async (e) => {
        const course = await ctx.db.get(e.courseId);
        const lessons = await ctx.db
          .query('lessons')
          .withIndex('by_course', (q) => q.eq('courseId', e.courseId))
          .collect();
        return {
          ...e,
          courseTitle: course?.title,
          courseThumbnail: course?.thumbnailUrl,
          totalLessons: lessons.length,
        };
      })
    );

    return enrollmentDetails;
  },
});

export const getUserEnrollments = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query('courseEnrollments')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(5);

    return await Promise.all(
      enrollments.map(async (e) => {
        const course = await ctx.db.get(e.courseId);
        const kid = await ctx.db.get(e.kidProfileId);
        const lessons = await ctx.db
          .query('lessons')
          .withIndex('by_course', (q) => q.eq('courseId', e.courseId))
          .collect();
        return {
          ...e,
          courseTitle: course?.title,
          courseThumbnail: course?.thumbnailUrl,
          kidName: kid?.name,
          totalLessons: lessons.length,
        };
      })
    );
  },
});
