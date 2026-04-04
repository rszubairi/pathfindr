"use node";

import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { Id } from './_generated/dataModel';

const APP_URL = 'https://thepathfindr.com';

// ─── Register Partner ─────────────────────────────────────────
// Creates a pending partner profile. No user account yet — that happens on approval.

export const registerPartner = action({
  args: {
    partnerType: v.union(v.literal('individual'), v.literal('company')),
    companyName: v.optional(v.string()),
    personInChargeName: v.string(),
    location: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; profileId: string }> => {
    const result = await ctx.runMutation(api.partners.createPartnerProfile, {
      partnerType: args.partnerType,
      companyName: args.companyName,
      personInChargeName: args.personInChargeName,
      location: args.location,
      address: args.address,
      phone: args.phone,
      email: args.email,
      website: args.website,
    });

    // Send acknowledgement email to the partner
    const resendApiKey = process.env.RESEND_API_KEY;
    const subject = 'Your Pathfindr Partner Application Has Been Received';
    const partnerName = args.companyName || args.personInChargeName;
    const body = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Pathfindr</h1>
        </div>
        <h2 style="color: #111827; font-size: 20px;">Thank you for applying, ${partnerName}!</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
          We've received your partner application and our team will review it shortly. We'll reach out to you at <strong>${args.email}</strong> once a decision has been made.
        </p>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
          If approved, you'll receive a separate email with your account credentials and partner code to get started.
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          If you have any questions, please contact us at <a href="mailto:support@thepathfindr.com" style="color: #2563eb;">support@thepathfindr.com</a>.
        </p>
      </body>
      </html>
    `;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Pathfindr <noreply@thepathfindr.com>',
          to: args.email,
          subject,
          html: body,
        });
      } catch (err) {
        console.error('Failed to send partner acknowledgement email:', err);
      }
    } else {
      console.log(`[DEV] Partner application acknowledgement for: ${args.email}`);
    }

    await ctx.runMutation(api.emailLogs.createLog, {
      recipientEmail: args.email,
      subject,
      body,
      type: 'partner_application_received',
      status: 'sent',
    });

    return { success: true, profileId: result.profileId };
  },
});

// ─── Approve Partner ──────────────────────────────────────────
// Called by admin. Generates a password, creates user account, sends credentials email.

export const approvePartner = action({
  args: {
    partnerProfileId: v.id('partnerProfiles'),
    adminUserId: v.id('users'),
    commissionPercentage: v.number(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // Verify admin
    const admin = await ctx.runQuery(api.auth.getCurrentUser, { userId: args.adminUserId });
    if (!admin || admin.role !== 'admin') {
      throw new Error('Only admins can approve partners');
    }

    // Get partner profile
    const profile = await ctx.runQuery(api.adminPartners.getPartnerProfileById, {
      profileId: args.partnerProfileId,
    });

    if (!profile) throw new Error('Partner profile not found');
    if (profile.approvalStatus !== 'pending') throw new Error('Partner is not in pending status');

    // Generate a random temporary password
    const crypto = await import('crypto');
    const rawPassword = crypto.randomBytes(6).toString('hex').toUpperCase().replace(/(.{3})/, '$1-');
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Create user account for the partner
    const userId = await ctx.runMutation(api.adminPartners.createPartnerUserAccount, {
      email: profile.email,
      passwordHash,
      fullName: profile.personInChargeName,
      phone: profile.phone,
    });

    // Update the partner profile: link userId, set approved, set commission
    await ctx.runMutation(api.adminPartners.setPartnerApproved, {
      profileId: args.partnerProfileId,
      userId: userId as Id<'users'>,
      adminUserId: args.adminUserId,
      commissionPercentage: args.commissionPercentage,
    });

    // Send approval email with credentials
    const resendApiKey = process.env.RESEND_API_KEY;
    const partnerName = profile.companyName || profile.personInChargeName;
    const subject = 'Welcome to Pathfindr — Your Partner Account is Ready';
    const loginUrl = `${APP_URL}/login`;
    const body = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Pathfindr</h1>
        </div>
        <h2 style="color: #111827; font-size: 20px;">Congratulations, ${partnerName}!</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
          Your partner application has been approved. You can now access your partner portal using the credentials below.
        </p>

        <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Login Email:</strong> ${profile.email}</p>
          <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;"><strong>Temporary Password:</strong> <span style="font-family: monospace; font-size: 16px; background: #fff; padding: 2px 8px; border-radius: 4px; border: 1px solid #d1d5db;">${rawPassword}</span></p>
          <p style="margin: 0; color: #374151; font-size: 14px;"><strong>Your Partner Code:</strong> <span style="font-family: monospace; font-size: 16px; background: #dbeafe; padding: 2px 8px; border-radius: 4px; color: #1d4ed8;">${profile.partnerCode}</span></p>
        </div>

        <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">
          Please log in and update your password as soon as possible. Share your partner code with students — when they register using your code, they'll be linked to your account.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${loginUrl}"
             style="background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
            Access Partner Portal
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          Your commission rate has been set at <strong>${args.commissionPercentage}%</strong> for each paying student introduction.
          For support, contact <a href="mailto:support@thepathfindr.com" style="color: #2563eb;">support@thepathfindr.com</a>.
        </p>
      </body>
      </html>
    `;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Pathfindr <noreply@thepathfindr.com>',
          to: profile.email,
          subject,
          html: body,
        });
      } catch (err) {
        console.error('Failed to send partner approval email:', err);
      }
    } else {
      console.log(`[DEV] Partner approval email for: ${profile.email} | Password: ${rawPassword}`);
    }

    await ctx.runMutation(api.emailLogs.createLog, {
      recipientEmail: profile.email,
      subject,
      body,
      userId: userId as Id<'users'>,
      type: 'partner_approved',
      status: 'sent',
    });

    return { success: true };
  },
});

// ─── Reject Partner ───────────────────────────────────────────
// Sends a rejection email with optional reason.

export const rejectPartner = action({
  args: {
    partnerProfileId: v.id('partnerProfiles'),
    adminUserId: v.id('users'),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const admin = await ctx.runQuery(api.auth.getCurrentUser, { userId: args.adminUserId });
    if (!admin || admin.role !== 'admin') {
      throw new Error('Only admins can reject partners');
    }

    const profile = await ctx.runQuery(api.adminPartners.getPartnerProfileById, {
      profileId: args.partnerProfileId,
    });
    if (!profile) throw new Error('Partner profile not found');

    await ctx.runMutation(api.adminPartners.setPartnerRejected, {
      profileId: args.partnerProfileId,
      adminUserId: args.adminUserId,
      reason: args.reason,
    });

    // Send rejection email
    const resendApiKey = process.env.RESEND_API_KEY;
    const partnerName = profile.companyName || profile.personInChargeName;
    const subject = 'Update on Your Pathfindr Partner Application';
    const body = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Pathfindr</h1>
        </div>
        <h2 style="color: #111827; font-size: 20px;">Partner Application Update</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
          Dear ${partnerName}, thank you for your interest in becoming a Pathfindr partner.
          After reviewing your application, we are unable to approve it at this time.
        </p>
        ${args.reason ? `<p style="color: #4b5563; font-size: 14px; line-height: 1.5;"><strong>Reason:</strong> ${args.reason}</p>` : ''}
        <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">
          If you believe this is in error or would like to reapply, please contact us at
          <a href="mailto:support@thepathfindr.com" style="color: #2563eb;">support@thepathfindr.com</a>.
        </p>
      </body>
      </html>
    `;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Pathfindr <noreply@thepathfindr.com>',
          to: profile.email,
          subject,
          html: body,
        });
      } catch (err) {
        console.error('Failed to send partner rejection email:', err);
      }
    } else {
      console.log(`[DEV] Partner rejection email for: ${profile.email}`);
    }

    await ctx.runMutation(api.emailLogs.createLog, {
      recipientEmail: profile.email,
      subject,
      body,
      type: 'partner_rejected',
      status: 'sent',
    });

    return { success: true };
  },
});
