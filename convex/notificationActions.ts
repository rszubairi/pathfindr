"use node";

import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import { Resend } from 'resend';

import { getAppUrl } from './utils';

const APP_URL = getAppUrl();

// Send notification emails to all subscribed users when a scholarship opens
export const sendScholarshipOpenNotifications = action({
  args: {
    scholarshipId: v.id('scholarships'),
  },
  handler: async (ctx, args) => {
    // Get scholarship details
    const scholarship = await ctx.runQuery(api.scholarships.getById, {
      id: args.scholarshipId,
    });

    if (!scholarship) {
      console.error('Scholarship not found:', args.scholarshipId);
      return;
    }

    // Get all un-notified subscriptions for this scholarship
    const allSubscriptions = await ctx.runQuery(
      api.notifications.getUnnotifiedSubscriptions,
      { scholarshipId: args.scholarshipId }
    );

    if (allSubscriptions.length === 0) {
      console.log('No subscriptions to notify for scholarship:', scholarship.name);
      return;
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    for (const sub of allSubscriptions) {
      const scholarshipUrl = `${APP_URL}/scholarships/detail?id=${scholarship._id}`;

      if (!resendApiKey) {
        console.log(
          `[DEV] Notification email to ${sub.email}: "${scholarship.name}" is now open! ${scholarshipUrl}`
        );
      } else {
        try {
          const resend = new Resend(resendApiKey);
          await resend.emails.send({
            from: 'Pathfindr <noreply@thepathfindr.com>',
            to: sub.email,
            subject: `🎓 "${scholarship.name}" is now open for applications!`,
            html: `
              <!DOCTYPE html>
              <html>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Pathfindr</h1>
                </div>
                <h2 style="color: #111827; font-size: 20px;">Great news!</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
                  The scholarship you were waiting for is now accepting applications:
                </p>
                <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; margin: 24px 0;">
                  <h3 style="color: #0369a1; font-size: 18px; margin: 0 0 8px 0;">${scholarship.name}</h3>
                  <p style="color: #4b5563; font-size: 14px; margin: 0 0 4px 0;">
                    <strong>Provider:</strong> ${scholarship.provider}
                  </p>
                  <p style="color: #4b5563; font-size: 14px; margin: 0 0 4px 0;">
                    <strong>Value:</strong> ${scholarship.currency} ${scholarship.value.toLocaleString()}
                  </p>
                  <p style="color: #4b5563; font-size: 14px; margin: 0;">
                    <strong>Deadline:</strong> ${new Date(scholarship.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${scholarshipUrl}" style="background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                    Apply Now
                  </a>
                </div>
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 32px;">
                  You received this email because you signed up for notifications on Pathfindr.
                </p>
              </body>
              </html>
            `,
          });
        } catch (err) {
          console.error(`Failed to send notification to ${sub.email}:`, err);
        }
      }

      // Mark as notified
      await ctx.runMutation(api.notifications.markNotified, {
        notificationId: sub._id,
      });
    }

    console.log(
      `Sent ${allSubscriptions.length} notification(s) for scholarship: ${scholarship.name}`
    );
  },
});

export const sendPaymentSuccessEmail = action({
  args: {
    userId: v.id('users'),
    tier: v.union(v.literal('pro'), v.literal('expert')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.auth.getCurrentUser, { userId: args.userId });
    if (!user) return;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) return;

    const resend = new Resend(resendApiKey);
    const whatsappLink = 'https://chat.whatsapp.com/L8h933w4nVP8yB6jXm1T7H?mode=gi_t';

    try {
      await resend.emails.send({
        from: 'Pathfindr <noreply@thepathfindr.com>',
        to: user.email,
        subject: `Welcome to Pathfindr! ${args.tier === 'pro' ? 'Pro' : 'Expert'} Subscription Confirmed 🎓`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #edf2f7; border-radius: 12px;">
            <h2 style="color: #2b6cb0;">Payment Successful!</h2>
            <p>Hi ${user.fullName},</p>
            <p>Thank you for choosing Pathfindr! Your annual <strong>${args.tier.toUpperCase()}</strong> subscription is now active.</p>
            
            <div style="background: #ebf8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2c5282;">Exclusive Community Access</h3>
              <p>As a premium member, you can now join our exclusive WhatsApp community for real-time updates and support:</p>
              <a href="${whatsappLink}" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Join WhatsApp Group</a>
            </div>

            <p>You now have access to:</p>
            <ul>
              <li>Unlimited scholarship notifications</li>
              <li>Priority internship applications</li>
              <li>Exclusive career development resources</li>
            </ul>

            <p>If you have any questions, simply reply to this email.</p>
            <p>Best regards,<br/>The Pathfindr Team</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Failed to send payment success email:', err);
    }
  },
});
