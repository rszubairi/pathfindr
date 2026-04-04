import { v } from 'convex/values';
import { query } from './_generated/server';

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
