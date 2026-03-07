import { mutation } from './_generated/server';
import { seedScholarships as scholarshipData } from './seedData';

// This mutation will seed the database with initial scholarship data
export const seedScholarships = mutation({
  handler: async (ctx) => {
    // Check if scholarships already exist
    const existing = await ctx.db.query('scholarships').first();
    if (existing) {
      return { message: 'Database already seeded', count: 0 };
    }

    // Insert all scholarships
    const ids = [];
    for (const scholarship of scholarshipData) {
      const newId = await ctx.db.insert('scholarships', scholarship);
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
