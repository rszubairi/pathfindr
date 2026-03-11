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
      }
    );

    // Send confirmation email
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log(
        `[DEV] Institution registered: ${args.institutionName} (${args.email}) - awaiting admin approval`
      );
    } else {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Pathfindr <noreply@thepathfindr.com>',
          to: args.email,
          subject: 'Institution Registration Received - Pathfindr',
          html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Pathfindr</h1>
              </div>
              <h2 style="color: #111827; font-size: 20px;">Registration Received</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                Thank you for registering <strong>${args.institutionName}</strong> on Pathfindr.
              </p>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                Your registration is currently under review. Our team will verify your institution details
                and you will receive an email once your account has been approved.
              </p>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="color: #0369a1; font-size: 14px; margin: 0;">
                  <strong>What happens next?</strong><br/>
                  Our team will review your corporate identity and contact your person in charge for verification.
                  This typically takes 1-2 business days.
                </p>
              </div>
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 32px;">
                If you have questions, reply to this email or contact us at support@thepathfindr.com
              </p>
            </body>
            </html>
          `,
        });
      } catch (err) {
        console.error('Failed to send institution registration email:', err);
      }
    }

    return { userId, success: true };
  },
});
