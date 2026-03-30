import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

const educationSchema = v.object({
  id: v.string(),
  institutionName: v.string(),
  qualificationTitle: v.string(),
  fieldOfStudy: v.string(),
  startDate: v.string(),
  endDate: v.optional(v.string()),
  grade: v.optional(v.string()),
  gpa: v.optional(v.number()),
});

const certificateSchema = v.object({
  id: v.string(),
  title: v.string(),
  issuer: v.string(),
  dateIssued: v.string(),
});

const projectSchema = v.object({
  id: v.string(),
  title: v.string(),
  description: v.string(),
  technologies: v.array(v.string()),
  startDate: v.string(),
  endDate: v.optional(v.string()),
});

const testScoresSchema = v.object({
  sat: v.optional(v.number()),
  ielts: v.optional(v.number()),
  toefl: v.optional(v.number()),
  gre: v.optional(v.number()),
  gmat: v.optional(v.number()),
});

const extracurricularSchema = v.object({
  id: v.string(),
  name: v.string(),
  category: v.union(
    v.literal('sports'),
    v.literal('arts'),
    v.literal('leadership'),
    v.literal('community'),
    v.literal('academic_club'),
    v.literal('cultural'),
    v.literal('other')
  ),
  role: v.string(),
  educationLevel: v.union(
    v.literal('school'),
    v.literal('college'),
    v.literal('university')
  ),
  startDate: v.string(),
  endDate: v.optional(v.string()),
  description: v.optional(v.string()),
  achievement: v.optional(v.string()),
});

// ─── Queries ────────────────────────────────────────────────

export const getByUserId = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('academicProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();
  },
});

export const getPublicResume = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const profile = await ctx.db
      .query('academicProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();

    return {
      user: {
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageId ? await ctx.storage.getUrl(user.profileImageId) : null,
      },
      profile,
    };
  },
});

// ─── Mutations ──────────────────────────────────────────────

export const upsert = mutation({
  args: {
    userId: v.id('users'),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.string()),
    nationality: v.optional(v.string()),
    country: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    phone: v.optional(v.string()),
    education: v.array(educationSchema),
    testScores: testScoresSchema,
    certificates: v.array(certificateSchema),
    projects: v.array(projectSchema),
    skills: v.array(v.string()),
    interests: v.array(v.string()),
    preferredCountries: v.array(v.string()),
    availability: v.optional(v.string()),
    extracurriculars: v.optional(v.array(extracurricularSchema)),
  },
  handler: async (ctx, args) => {
    const { userId, ...profileData } = args;
    const now = new Date().toISOString();

    // Check for existing profile
    const existing = await ctx.db
      .query('academicProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...profileData,
        profileStatus: 'pending_review' as const,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert('academicProfiles', {
      userId,
      ...profileData,
      profileStatus: 'pending_review',
      createdAt: now,
      updatedAt: now,
    });
  },
});

const subjectScoreEntrySchema = v.object({
  id: v.string(),
  examType: v.union(v.literal('IGCSE'), v.literal('SPM'), v.literal('O-Level')),
  year: v.optional(v.string()),
  subjects: v.array(v.object({
    subject: v.string(),
    grade: v.string(),
  })),
});

export const updateSubjectScores = mutation({
  args: {
    userId: v.id('users'),
    subjectScores: v.array(subjectScoreEntrySchema),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('academicProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();

    if (!existing) throw new Error('Profile not found');

    await ctx.db.patch(existing._id, {
      subjectScores: args.subjectScores,
      updatedAt: new Date().toISOString(),
    });

    return existing._id;
  },
});

export const updateProfileStatus = mutation({
  args: {
    profileId: v.id('academicProfiles'),
    status: v.union(
      v.literal('incomplete'),
      v.literal('pending_review'),
      v.literal('verified')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, {
      profileStatus: args.status,
      updatedAt: new Date().toISOString(),
    });
  },
});
