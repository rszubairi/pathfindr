import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrUpdate = mutation({
    args: {
        university: v.string(),
        title: v.string(),
        requirements: v.string(),
        criteria: v.string(),
        timePeriod: v.string(),
        documentsNeeded: v.array(v.string()),
        applicationLink: v.string(),
        sourceUrl: v.string(),
        lastUpdated: v.string(),
        category: v.optional(v.string()),
        amount: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if scholarship with same title and university exists
        const existing = await ctx.db
            .query("scholarships")
            .withIndex("by_university", (q) => q.eq("university", args.university))
            .filter((q) => q.eq(q.field("title"), args.title))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, args);
            return existing._id;
        } else {
            return await ctx.db.insert("scholarships", args);
        }
    },
});

export const getByUniversity = query({
    args: { university: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("scholarships")
            .withIndex("by_university", (q) => q.eq("university", args.university))
            .collect();
    },
});

export const listAll = query({
    handler: async (ctx) => {
        return await ctx.db.query("scholarships").collect();
    },
});
