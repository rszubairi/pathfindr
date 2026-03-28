import { mutation } from './_generated/server';
import { v } from 'convex/values';

const UNIVERSITY_RANKINGS: Record<string, { local: number, international: number }> = {
  "Universiti Malaya": { local: 1, international: 65 },
  "University of Malaya": { local: 1, international: 65 },
  "Universiti Putra Malaysia": { local: 2, international: 123 },
  "Universiti Kebangsaan Malaysia": { local: 3, international: 129 },
  "Universiti Sains Malaysia": { local: 4, international: 143 },
  "Universiti Teknologi Malaysia": { local: 5, international: 188 },
  "Taylor's University": { local: 6, international: 284 },
  "Taylor’s University": { local: 6, international: 284 },
  "UCSI University": { local: 7, international: 300 },
  "Sunway University": { local: 8, international: 586 },
  "Universiti Teknologi Petronas": { local: 9, international: 307 },
  "UTP": { local: 9, international: 307 },
  "Monash University Malaysia": { local: 10, international: 42 },
  "Management and Science University": { local: 11, international: 580 },
  "MSU": { local: 11, international: 580 },
};

export const updateUniversityRankings = mutation({
  args: {},
  handler: async (ctx) => {
    const scholarships = await ctx.db.query('scholarships').collect();
    let updatedCount = 0;

    for (const scholarship of scholarships) {
      if (scholarship.providerType === 'university') {
        const ranking = UNIVERSITY_RANKINGS[scholarship.provider];
        if (ranking) {
          await ctx.db.patch(scholarship._id, {
            localRanking: ranking.local,
            internationalRanking: ranking.international,
            updatedAt: new Date().toISOString(),
          });
          updatedCount++;
        }
      }
    }

    return { updatedCount };
  },
});
