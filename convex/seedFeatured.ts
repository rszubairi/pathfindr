import { mutation } from "./_generated/server";

export const seedArr = mutation({
  args: {},
  handler: async (ctx) => {
    // Only take active scholarships to ensure they are visible in the main list
    const scholarships = await ctx.db
      .query("scholarships")
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(3);
      
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    for (const scholarship of scholarships) {
      await ctx.db.patch(scholarship._id, {
        isFeatured: true,
        featuredUntil: thirtyDaysFromNow,
      });
    }

    return scholarships.length;
  },
});
