import { v } from 'convex/values';
import { query } from './_generated/server';

export const getLeaderboard = query({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    const leaderboard = await ctx.db
      .query('leaderboard')
      .withIndex('by_course_and_score', (q) => q.eq('courseId', args.courseId))
      .order('desc')
      .take(100);

    // Hydrate with names
    const hydratedLeaderboard = await Promise.all(
      leaderboard.map(async (entry) => {
        const kid = await ctx.db.get(entry.kidProfileId);
        return {
          ...entry,
          kidName: kid?.name,
          avatarUrl: kid?.avatarUrl,
        };
      })
    );

    return hydratedLeaderboard;
  },
});
