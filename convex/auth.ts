import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// ─── Queries ────────────────────────────────────────────────

export const getCurrentUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const { passwordHash, verificationToken, tokenExpiry, ...safeUser } = user;

    let profileImageUrl: string | null = null;
    if (user.profileImageId) {
      profileImageUrl = await ctx.storage.getUrl(user.profileImageId);
    }

    return { ...safeUser, profileImageUrl };
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .first();
  },
});

// ─── Mutations ──────────────────────────────────────────────

export const createUser = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
    phone: v.string(),
    verificationToken: v.string(),
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

    const now = new Date().toISOString();
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const userId = await ctx.db.insert('users', {
      email,
      passwordHash: args.passwordHash,
      fullName: args.fullName,
      phone: args.phone,
      role: 'student',
      emailVerified: true,
      verificationToken: args.verificationToken,
      tokenExpiry,
      profileCompleted: false,
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

export const verifyEmail = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_verification_token', (q) =>
        q.eq('verificationToken', args.token)
      )
      .first();

    if (!user) {
      throw new Error('Invalid verification token');
    }

    if (user.tokenExpiry && Date.now() > user.tokenExpiry) {
      throw new Error('Verification token has expired. Please request a new one.');
    }

    await ctx.db.patch(user._id, {
      emailVerified: true,
      verificationToken: undefined,
      tokenExpiry: undefined,
      updatedAt: new Date().toISOString(),
    });

    return { userId: user._id, email: user.email };
  },
});

export const updateVerificationToken = mutation({
  args: {
    userId: v.id('users'),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    await ctx.db.patch(args.userId, {
      verificationToken: args.token,
      tokenExpiry,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const markProfileCompleted = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      profileCompleted: true,
      updatedAt: new Date().toISOString(),
    });
  },
});
