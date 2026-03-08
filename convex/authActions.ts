"use node";

import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

const JWT_SECRET = process.env.JWT_SECRET || 'pathfindr-dev-secret-change-in-production';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Helper: send verification email (not an action, just a function)
async function sendEmail(email: string, fullName: string, token: string) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log(`[DEV] Verification link: ${APP_URL}/verify-email/${token}`);
    return;
  }

  const resend = new Resend(resendApiKey);
  const verificationUrl = `${APP_URL}/verify-email/${token}`;

  await resend.emails.send({
    from: 'Pathfindr <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your Pathfindr account',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Pathfindr</h1>
        </div>
        <h2 style="color: #111827; font-size: 20px;">Welcome, ${fullName}!</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
          Thanks for signing up for Pathfindr. Please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}"
             style="background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
          This link will expire in 24 hours. If you didn't create this account, you can safely ignore this email.
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          If the button doesn't work, copy and paste this URL into your browser:<br>
          <a href="${verificationUrl}" style="color: #2563eb;">${verificationUrl}</a>
        </p>
      </body>
      </html>
    `,
  });
}

// ─── Register ───────────────────────────────────────────────

export const registerUser = action({
  args: {
    email: v.string(),
    password: v.string(),
    fullName: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args): Promise<{ userId: string; success: boolean }> => {
    const passwordHash = await bcrypt.hash(args.password, 10);

    const crypto = await import('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const userId = await ctx.runMutation(api.auth.createUser, {
      email: args.email,
      passwordHash,
      fullName: args.fullName,
      phone: args.phone,
      verificationToken,
    });

    await sendEmail(args.email.toLowerCase(), args.fullName, verificationToken);

    return { userId, success: true };
  },
});

// ─── Login ──────────────────────────────────────────────────

export const loginUser = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ user: Record<string, any>; token: string }> => {
    const user = await ctx.runQuery(api.auth.getUserByEmail, {
      email: args.email,
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(args.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, verificationToken, tokenExpiry, ...safeUser } = user;

    return { user: safeUser, token };
  },
});

// ─── Resend Verification ────────────────────────────────────

export const resendVerification = action({
  args: { email: v.string() },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const user = await ctx.runQuery(api.auth.getUserByEmail, {
      email: args.email,
    });

    if (!user) {
      return { success: true };
    }

    if (user.emailVerified) {
      throw new Error('This email is already verified. Please log in.');
    }

    const crypto = await import('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await ctx.runMutation(api.auth.updateVerificationToken, {
      userId: user._id,
      token: verificationToken,
    });

    await sendEmail(user.email, user.fullName, verificationToken);

    return { success: true };
  },
});
