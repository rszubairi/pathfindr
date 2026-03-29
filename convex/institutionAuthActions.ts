"use node";

import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Resend } from 'resend';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const providerTypeValidator = v.union(
  v.literal('government'),
  v.literal('university'),
  v.literal('corporate'),
  v.literal('ngo'),
  v.literal('foundation'),
  v.literal('individual')
);

export const registerInstitution = action({
  args: {
    email: v.string(),
    password: v.string(),
    phone: v.string(),
    institutionName: v.string(),
    corporateIdentityNumber: v.string(),
    picName: v.string(),
    picEmail: v.string(),
    picPhone: v.string(),
    providerType: providerTypeValidator,
    website: v.optional(v.string()),
    role: v.optional(v.union(v.literal('institution'), v.literal('corporate'))),
  },
  handler: async (ctx, args): Promise<{ userId: string; success: boolean }> => {
    // Hash password
    const passwordHash = await bcrypt.hash(args.password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user + institution profile
    const userId = await ctx.runMutation(
      api.institutionAuth.createInstitutionUser,
      {
        email: args.email,
        passwordHash,
        fullName: args.institutionName,
        phone: args.phone,
        verificationToken,
        institutionName: args.institutionName,
        corporateIdentityNumber: args.corporateIdentityNumber,
        picName: args.picName,
        picEmail: args.picEmail,
        picPhone: args.picPhone,
        providerType: args.providerType,
        website: args.website,
        role: args.role,
      }
    );

    // Send confirmation email
    const resendApiKey = process.env.RESEND_API_KEY;
    const isCorporate = args.role === 'corporate';
    const entityName = isCorporate ? 'Corporate' : 'Institution';
    const verificationUrl = `${APP_URL}/verify-email/confirm?token=${verificationToken}`;

    if (!resendApiKey) {
      console.log(
        `[DEV] ${entityName} registered: ${args.institutionName} (${args.email}) - awaiting admin approval. Verification link: ${verificationUrl}`
      );
    } else {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Pathfindr <noreply@thepathfindr.com>',
          to: args.email,
          subject: `Verify Your ${entityName} Email - Pathfindr`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Pathfindr</h1>
              </div>
              <h2 style="color: #111827; font-size: 20px;">Welcome, ${args.picName}!</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                Thank you for registering <strong>${args.institutionName}</strong> on Pathfindr.
                Please verify your email address by clicking the button below:
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}"
                   style="background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                After verification, your account will undergo a 1-2 day review process by our team.
                You will be notified once your institution has been approved to list scholarships.
              </p>
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 32px;">
                If you have questions, reply to this email or contact us at support@thepathfindr.com
              </p>
            </body>
            </html>
          `,
        });
      } catch (err) {
        console.error(`Failed to send ${entityName.toLowerCase()} registration email:`, err);
      }
    }


    return { userId, success: true };
  },
});
