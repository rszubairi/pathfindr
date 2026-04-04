import { v } from 'convex/values';
import { query } from './_generated/server';

export const getLeaderboard = query({
  args: { 
    courseId: v.optional(v.id('courses')),
    countryCode: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // 1. Get all kid profiles (or a reasonably large sample)
    const allKids = await ctx.db
        .query('kidProfiles')
        .take(200);

    // 2. Map and join with leaderboard data
    const hydratedLeaderboard = await Promise.all(
        allKids.map(async (kid) => {
            const leaderboardEntry = await ctx.db
                .query('leaderboard')
                .withIndex('by_kid', (q) => q.eq('kidProfileId', kid._id))
                .unique();
            
            const academicProfile = await ctx.db
                .query('academicProfiles')
                .withIndex('by_user_id', (q) => q.eq('userId', kid.userId))
                .unique();
            
            return {
                _id: kid._id,
                kidProfileId: kid._id,
                userId: kid.userId,
                kidName: kid.name,
                avatarUrl: kid.avatarUrl,
                countryCode: academicProfile?.countryCode,
                totalScore: leaderboardEntry?.totalScore || 0,
                completedAssessments: leaderboardEntry?.completedAssessments || 0,
                streak: leaderboardEntry?.streak || 0,
                lastActivityAt: leaderboardEntry?.lastActivityAt || kid._creationTime.toString()
            };
        })
    );

    // 3. Sort by score (desc) then by creation time
    const sorted = hydratedLeaderboard.sort((a,b) => b.totalScore - a.totalScore);

    // Filter by country if requested
    if (args.countryCode) {
        return sorted.filter(e => e.countryCode === args.countryCode).slice(0, 100);
    }

    return sorted.slice(0, 100);
  },
});

export const getKidRankings = query({
    args: { userId: v.id('users'), kidProfileId: v.id('kidProfiles') },
    handler: async (ctx, args) => {
        const academicProfile = await ctx.db
            .query('academicProfiles')
            .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
            .unique();
        
        const countryCode = academicProfile?.countryCode;

        // Global Rank
        const allEntries = await ctx.db
            .query('leaderboard')
            .collect();
        
        const sortedGlobal = [...allEntries].sort((a,b) => b.totalScore - a.totalScore);
        const globalRank = sortedGlobal.findIndex(e => e.kidProfileId === args.kidProfileId) + 1;

        // Country Rank
        let countryRank = 0;
        if (countryCode) {
            // This is slightly inefficient but works for now. 
            // In a real app we'd have a country index on leaderboard or a denormalized field.
            const countryEntries = await Promise.all(
                allEntries.map(async (e) => {
                    const profile = await ctx.db
                        .query('academicProfiles')
                        .withIndex('by_user_id', (q) => q.eq('userId', e.userId))
                        .unique();
                    return { ...e, countryCode: profile?.countryCode };
                })
            );
            const sortedCountry = countryEntries
                .filter(e => e.countryCode === countryCode)
                .sort((a,b) => b.totalScore - a.totalScore);
            countryRank = sortedCountry.findIndex(e => e.kidProfileId === args.kidProfileId) + 1;
        }

        return {
            globalRank: globalRank > 0 ? globalRank : "N/A",
            countryRank: countryRank > 0 ? countryRank : "N/A",
            countryCode
        };
    }
});
