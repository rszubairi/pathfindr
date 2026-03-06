import { mutation } from './_generated/server';

// This mutation will seed the database with initial scholarship data
export const seedScholarships = mutation({
  handler: async (ctx) => {
    // Check if scholarships already exist
    const existing = await ctx.db.query('scholarships').first();
    if (existing) {
      return { message: 'Database already seeded', count: 0 };
    }

    // Import mock data (we'll populate this from our mockData.ts)
    const scholarships = await import('../apps/web/src/lib/mockData');
    const mockScholarships = scholarships.mockScholarships;

    // Insert all scholarships
    const ids = [];
    for (const scholarship of mockScholarships) {
      // Remove the id field since Convex generates its own
      const { id, ...scholarshipData } = scholarship as any;
      const newId = await ctx.db.insert('scholarships', scholarshipData);
      ids.push(newId);
    }

    return {
      message: 'Database seeded successfully',
      count: ids.length,
    };
  },
});

// Clear all scholarships (for testing/resetting)
export const clearScholarships = mutation({
  handler: async (ctx) => {
    const scholarships = await ctx.db.query('scholarships').collect();
    for (const scholarship of scholarships) {
      await ctx.db.delete(scholarship._id);
    }
    return { message: 'All scholarships cleared', count: scholarships.length };
  },
});
