import { v } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";

const BASE_62_CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateShortCode(length = 6): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += BASE_62_CHARACTERS.charAt(Math.floor(Math.random() * BASE_62_CHARACTERS.length));
  }
  return result;
}

export const getOrCreateShortUrl = mutation({
  args: {
    targetPath: v.string(),
    type: v.union(v.literal('university'), v.literal('scholarship'), v.literal('other')),
  },
  handler: async (ctx, args) => {
    // Check if it already exists
    const existing = await ctx.db
      .query("shortUrls")
      .withIndex("by_targetPath", (q) => q.eq("targetPath", args.targetPath))
      .first();

    if (existing) {
      return existing.shortCode;
    }

    // Generate a unique shortCode
    let shortCode = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      shortCode = generateShortCode();
      const duplicate = await ctx.db
        .query("shortUrls")
        .withIndex("by_shortCode", (q) => q.eq("shortCode", shortCode))
        .first();
      
      if (!duplicate) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error("Failed to generate a unique short code after 10 attempts.");
    }

    await ctx.db.insert("shortUrls", {
      shortCode,
      targetPath: args.targetPath,
      type: args.type,
      createdAt: new Date().toISOString(),
    });

    return shortCode;
  },
});

export const resolveShortCode = query({
  args: {
    shortCode: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("shortUrls")
      .withIndex("by_shortCode", (q) => q.eq("shortCode", args.shortCode))
      .unique();

    return record?.targetPath || null;
  },
});
