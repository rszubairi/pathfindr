import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getAssessmentByCourse = query({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('assessments')
      .withIndex('by_course', (q) => q.eq('courseId', args.courseId))
      .filter((q) => q.eq(q.field('status'), 'published'))
      .unique();
  },
});

export const submitAssessment = mutation({
  args: {
    assessmentId: v.id('assessments'),
    kidProfileId: v.id('kidProfiles'),
    answers: v.array(v.object({
      questionId: v.string(),
      answer: v.string(),
      isCorrect: v.boolean(),
      pointsEarned: v.number(),
    })),
    score: v.number(),
    totalPoints: v.number(),
    percentage: v.number(),
    passed: v.boolean(),
    timeSpentSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email!))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const currentAttempt = (await ctx.db
      .query('assessmentResults')
      .withIndex('by_kid', (q) => q.eq('kidProfileId', args.kidProfileId))
      .filter((q) => q.eq(q.field('assessmentId'), args.assessmentId))
      .collect()).length + 1;

    const resultId = await ctx.db.insert('assessmentResults', {
      userId: user._id,
      kidProfileId: args.kidProfileId,
      assessmentId: args.assessmentId,
      courseId: (await ctx.db.get(args.assessmentId))!.courseId,
      answers: args.answers,
      score: args.score,
      totalPoints: args.totalPoints,
      percentage: args.percentage,
      passed: args.passed,
      timeSpentSeconds: args.timeSpentSeconds,
      attemptNumber: currentAttempt,
      completedAt: new Date().toISOString(),
    });

    return resultId;
  },
});

export const getAssessmentResults = query({
  args: { kidProfileId: v.id('kidProfiles'), assessmentId: v.optional(v.id('assessments')) },
  handler: async (ctx, args) => {
    let resultsQueryRaw = ctx.db
      .query('assessmentResults')
      .withIndex('by_kid', (q) => q.eq('kidProfileId', args.kidProfileId));

    if (args.assessmentId) {
      resultsQueryRaw = resultsQueryRaw.filter((q) => q.eq(q.field('assessmentId'), args.assessmentId!));
    }

    return await resultsQueryRaw.collect();
  },
});
