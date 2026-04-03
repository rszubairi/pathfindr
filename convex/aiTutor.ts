import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const logInteraction = mutation({
  args: {
    kidProfileId: v.id('kidProfiles'),
    lessonId: v.id('lessons'),
    breakpointIndex: v.number(),
    interactionType: v.union(v.literal('question'), v.literal('hint'), v.literal('correction'), v.literal('encouragement'), v.literal('explanation')),
    question: v.optional(v.string()),
    userResponse: v.optional(v.string()),
    aiResponse: v.string(),
    isCorrect: v.optional(v.boolean()),
    scoreDelta: v.optional(v.number()),
    responseTimeMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const { kidProfileId, ...interactionData } = args;
    const interactionId = await ctx.db.insert('aiTutorInteractions', {
      userId: (await ctx.db.get(kidProfileId))!.userId,
      kidProfileId,
      ...interactionData,
      createdAt: new Date().toISOString(),
    });

    return interactionId;
  },
});

export const getLessonInteractions = query({
  args: { kidProfileId: v.id('kidProfiles'), lessonId: v.id('lessons') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('aiTutorInteractions')
      .withIndex('by_kid_and_lesson', (q) => q.eq('kidProfileId', args.kidProfileId).eq('lessonId', args.lessonId))
      .collect();
  },
});
