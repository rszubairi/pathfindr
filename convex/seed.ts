import { mutation } from './_generated/server';
import { seedScholarships as scholarshipData } from './seedData';
import { scrapedScholarships } from './seedDataScraped';
import { boardingSchoolsData } from './seedDataBoardingSchools';

// This mutation will seed the database with initial scholarship data
export const seedScholarships = mutation({
  handler: async (ctx) => {
    // Check if scholarships already exist
    const existing = await ctx.db.query('scholarships').first();
    if (existing) {
      return { message: 'Database already seeded', count: 0 };
    }

    // Combine original mock data and newly scraped data
    const allScholarships = [...scholarshipData, ...scrapedScholarships];

    // Insert all scholarships
    const ids = [];
    for (const scholarship of allScholarships) {
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

// Seed boarding schools data
export const seedBoardingSchools = mutation({
  handler: async (ctx) => {
    // Check if boarding schools already exist
    const existing = await ctx.db.query('boardingSchools').first();
    if (existing) {
      return { message: 'Boarding schools already seeded', count: 0 };
    }

    const ids = [];
    for (const school of boardingSchoolsData) {
      const newId = await ctx.db.insert('boardingSchools', school);
      ids.push(newId);
    }

    return {
      message: 'Boarding schools seeded successfully',
      count: ids.length,
    };
  },
});

// Clear all boarding schools (for testing/resetting)
export const clearBoardingSchools = mutation({
  handler: async (ctx) => {
    const schools = await ctx.db.query('boardingSchools').collect();
    for (const school of schools) {
      await ctx.db.delete(school._id);
    }
    return { message: 'All boarding schools cleared', count: schools.length };
  },
});
