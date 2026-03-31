import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { seedScholarships as scholarshipData } from './seedData';
import { scrapedScholarships } from './seedDataScraped';
import { boardingSchoolsData } from './seedDataBoardingSchools';
import { spm2025Scholarships } from './seedDataSPM2025';

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

// Seed SPM 2025 Top 25 scholarships (skips duplicates by exact name)
export const seedSPM2025Scholarships = mutation({
  handler: async (ctx) => {
    const allExisting = await ctx.db.query('scholarships').collect();
    const existingNames = new Set(allExisting.map((s) => s.name.toLowerCase().trim()));

    const inserted = [];
    const skipped = [];

    for (const scholarship of spm2025Scholarships) {
      if (existingNames.has(scholarship.name.toLowerCase().trim())) {
        skipped.push(scholarship.name);
        continue;
      }

      await ctx.db.insert('scholarships', scholarship);
      inserted.push(scholarship.name);
    }

    return {
      message: `SPM 2025 scholarships seeded. Inserted: ${inserted.length}, Skipped (already exist): ${skipped.length}`,
      inserted,
      skipped,
    };
  },
});

// Seed an admin user
export const seedAdminUser = mutation({
  args: { passwordHash: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', 'admin@pathfindr.com'))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { role: 'admin', emailVerified: true });
      return { message: 'Updated existing admin user account to admin role.' };
    }

    const newId = await ctx.db.insert('users', {
      email: 'admin@pathfindr.com',
      passwordHash: args.passwordHash,
      fullName: 'System Admin',
      phone: '0000000000',
      role: 'admin',
      emailVerified: true,
      profileCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { message: 'Created new admin user successfully.' };
  },
});
