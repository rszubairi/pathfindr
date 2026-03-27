import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const providerTypeValidator = v.union(
  v.literal('government'),
  v.literal('university'),
  v.literal('corporate'),
  v.literal('ngo'),
  v.literal('foundation'),
  v.literal('individual')
);

// Create an institution user + profile in one transaction
export const createInstitutionUser = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
    phone: v.string(),
    verificationToken: v.string(),
    institutionName: v.string(),
    corporateIdentityNumber: v.string(),
    picName: v.string(),
    picEmail: v.string(),
    picPhone: v.string(),
    providerType: providerTypeValidator,
    website: v.optional(v.string()),
    role: v.optional(v.union(v.literal('institution'), v.literal('corporate'))),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();

    // Check for duplicate email
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existing) {
      throw new Error('An account with this email already exists');
    }

    // Check for duplicate corporate ID
    const existingCorp = await ctx.db
      .query('institutionProfiles')
      .withIndex('by_corporate_id', (q) =>
        q.eq('corporateIdentityNumber', args.corporateIdentityNumber)
      )
      .first();

    if (existingCorp) {
      throw new Error('An institution with this corporate identity number is already registered');
    }

    const now = new Date().toISOString();
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    // Create user with specified role (default to institution)
    const userId = await ctx.db.insert('users', {
      email,
      passwordHash: args.passwordHash,
      fullName: args.institutionName,
      phone: args.phone,
      role: args.role || 'institution',
      emailVerified: true,

      verificationToken: args.verificationToken,
      tokenExpiry,
      profileCompleted: true,
      createdAt: now,
      updatedAt: now,
    });

    // Create institution profile
    await ctx.db.insert('institutionProfiles', {
      userId,
      institutionName: args.institutionName,
      corporateIdentityNumber: args.corporateIdentityNumber,
      picName: args.picName,
      picEmail: args.picEmail,
      picPhone: args.picPhone,
      providerType: args.providerType,
      website: args.website,
      approvalStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

// Get institution profile by user ID
export const getInstitutionProfile = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('institutionProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();
  },
});

// Update institution profile
export const updateInstitutionProfile = mutation({
  args: {
    userId: v.id('users'),
    institutionName: v.optional(v.string()),
    picName: v.optional(v.string()),
    picEmail: v.optional(v.string()),
    picPhone: v.optional(v.string()),
    providerType: v.optional(providerTypeValidator),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('institutionProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();

    if (!profile) {
      throw new Error('Institution profile not found');
    }

    const { userId, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(profile._id, {
      ...cleanUpdates,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const getInstitutionProfileById = query({
  args: { profileId: v.id('institutionProfiles') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.profileId);
  },
});
