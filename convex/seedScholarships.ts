import { mutation } from "./_generated/server";
import { GCC_SCHOLARSHIPS } from "./seedDataScholarshipsGCC";

export const seedGCCScholarships = mutation({
  args: {},
  handler: async (ctx) => {
    for (const scholarship of GCC_SCHOLARSHIPS) {
      // Avoid duplicate by name and provider
      const existing = await ctx.db
        .query("scholarships")
        .withSearchIndex("search_name", (q) => q.search("name", scholarship.name))
        .filter((q) => q.eq(q.field("provider"), scholarship.provider))
        .first();

      if (!existing) {
        await ctx.db.insert("scholarships", scholarship);
        console.log(`Seeded scholarship: ${scholarship.name}`);
      } else {
        console.log(`Scholarship already exists: ${scholarship.name}`);
      }
    }
    return "GCC Scholarships seeded successfully";
  },
});
