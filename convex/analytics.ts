import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getUserKidsProgress = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const kids = await ctx.db
      .query('kidProfiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    const progressData = await Promise.all(
      kids.map(async (kid) => {
        const enrollments = await ctx.db
          .query('courseEnrollments')
          .withIndex('by_kid', (q) => q.eq('kidProfileId', kid._id))
          .collect();

        const sessions = await ctx.db
          .query('learningSessions')
          .withIndex('by_kid', (q) => q.eq('kidProfileId', kid._id))
          .collect();

        const totalTimeSpent = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
        const totalPoints = enrollments.reduce((acc, e) => acc + (e.totalScore || 0), 0);
        const averageProgress =
          enrollments.length > 0 ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length) : 0;

        // Get latest course
        let latestEnrollment = null;
        if (enrollments.length > 0) {
          const sorted = [...enrollments].sort((a, b) => 
            new Date(b.lastAccessedAt || b.enrolledAt).getTime() - 
            new Date(a.lastAccessedAt || a.enrolledAt).getTime()
          );
          latestEnrollment = sorted[0];
          const course = await ctx.db.get(latestEnrollment.courseId);
          latestEnrollment = {
            ...latestEnrollment,
            courseTitle: course?.title,
          };
        }

        return {
          kidId: kid._id,
          name: kid.name,
          avatarUrl: kid.avatarUrl,
          totalCourses: enrollments.length,
          completedCourses: enrollments.filter((e) => e.progress === 100).length,
          averageProgress,
          totalPoints,
          totalTimeSpent,
          latestCourse: latestEnrollment?.courseTitle,
          lastActive: latestEnrollment?.lastAccessedAt || kid.createdAt,
        };
      })
    );

    return progressData;
  },
});

export const getRecentLearners = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const kids = await ctx.db
            .query('kidProfiles')
            .order('desc')
            .take(args.limit || 10);
        
        return await Promise.all(
            kids.map(async (kid) => {
                const enrollmentCount = (await ctx.db
                    .query('courseEnrollments')
                    .withIndex('by_kid', (q) => q.eq('kidProfileId', kid._id))
                    .collect()).length;

                const profile = await ctx.db
                    .query('academicProfiles')
                    .withIndex('by_user_id', (q) => q.eq('userId', kid.userId))
                    .unique();

                return {
                    id: kid._id,
                    name: kid.name,
                    avatarUrl: kid.avatarUrl,
                    countryCode: profile?.countryCode,
                    enrollmentCount
                };
            })
        );
    }
});

// Start a new learning session
export const startSession = mutation({
  args: {
    userId: v.id('users'),
    kidProfileId: v.id('kidProfiles'),
    courseId: v.id('courses'),
    lessonId: v.id('lessons'),
    platform: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('learningSessions', {
      ...args,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
    });
  },
});

// Update session heartbeat (time spent)
export const updateHeartbeat = mutation({
  args: {
    sessionId: v.id('learningSessions'),
    incrementSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return;

    await ctx.db.patch(args.sessionId, {
      durationSeconds: session.durationSeconds + args.incrementSeconds,
      endTime: new Date().toISOString(),
    });

    // Also update the course enrollment total time
    const enrollment = await ctx.db
      .query('courseEnrollments')
      .withIndex('by_kid_and_course', (q) => q.eq('kidProfileId', session.kidProfileId).eq('courseId', session.courseId))
      .unique();

    if (enrollment) {
      await ctx.db.patch(enrollment._id, {
        totalTimeSpent: (enrollment.totalTimeSpent || 0) + args.incrementSeconds,
        lastAccessedAt: new Date().toISOString(),
      });
    }
  },
});

// End a learning session
export const endSession = mutation({
  args: {
    sessionId: v.id('learningSessions'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      endTime: new Date().toISOString(),
    });
  },
});
