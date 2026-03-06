import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    scholarships: defineTable({
        university: v.string(),
        title: v.string(),
        requirements: v.string(),
        criteria: v.string(),
        timePeriod: v.string(),
        documentsNeeded: v.array(v.string()),
        applicationLink: v.string(),
        sourceUrl: v.string(),
        lastUpdated: v.string(),
        category: v.optional(v.string()), // e.g., 'Merit', 'Need-based', 'Sports'
        amount: v.optional(v.string()),
    }).index("by_university", ["university"]),
});
