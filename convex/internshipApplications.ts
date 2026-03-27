import { v } from 'convex/values';
import { mutation, query, action } from './_generated/server';
import { api } from './_generated/api';
import { Resend } from 'resend';

export const apply = mutation({
  args: {
    internshipId: v.id('internships'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email!))
      .first();

    if (!user || user.role !== 'student') {
      throw new Error('Only students can apply for internships');
    }

    // Check membership (pro/expert)
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .first();

    if (!subscription) {
      throw new Error('A membership is required to apply for internships');
    }

    const existing = await ctx.db
      .query('internshipApplications')
      .withIndex('by_internship_and_user', (q) =>
        q.eq('internshipId', args.internshipId).eq('userId', user._id)
      )
      .first();

    if (existing) {
      throw new Error('You have already applied for this internship');
    }

    const now = new Date().toISOString();
    const applicationId = await ctx.db.insert('internshipApplications', {
      internshipId: args.internshipId,
      userId: user._id,
      status: 'applied',
      appliedAt: now,
      updatedAt: now,
    });

    // Notify corporate and student (implemented as an action below)
    return { applicationId, success: true };
  },
});

export const notifyApplication = action({
  args: {
    applicationId: v.id('internshipApplications'),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) return;

    // Get Application Details
    const application: any = await ctx.runQuery(api.internshipApplications.getById, {
      id: args.applicationId,
    });
    if (!application) return;

    // Get Student Details
    const student: any = await ctx.runQuery(api.auth.getCurrentUser, {
      userId: application.userId,
    });
    if (!student) return;

    // Get Internship Details
    const internship: any = await ctx.runQuery(api.internships.getById, {
      id: application.internshipId,
    });
    if (!internship) return;

    // Get Corporate Details (via institutionProfile)
    const company: any = await ctx.runQuery(api.institutionAuth.getInstitutionProfileById, {
      profileId: internship.companyId,
    });
    if (!company) return;

    const corporateUser: any = await ctx.runQuery(api.auth.getCurrentUser, {
      userId: company.userId,
    });
    if (!corporateUser) return;

    const resend = new Resend(resendApiKey);

    // 1. Notify Corporate
    try {
      await resend.emails.send({
        from: 'Pathfindr <noreply@thepathfindr.com>',
        to: corporateUser.email,
        subject: `New Application: ${internship.title} - Pathfindr`,
        html: `
          <h3>New Internship Application</h3>
          <p>A student has applied for your internship <strong>${internship.title}</strong>.</p>
          <ul>
            <li><strong>Student Name:</strong> ${student.fullName}</li>
            <li><strong>Student Email:</strong> ${student.email}</li>
          </ul>
          <p>Please log in to your dashboard to view more details.</p>
        `,
      });
    } catch (err) {
      console.error('Failed to notify corporate:', err);
    }

    // 2. Notify Student (Confirmation)
    try {
      await resend.emails.send({
        from: 'Pathfindr <noreply@thepathfindr.com>',
        to: student.email,
        subject: `Application Sent: ${internship.title} - Pathfindr`,
        html: `
          <h3>Application Received</h3>
          <p>Your application for <strong>${internship.title}</strong> has been sent to the employer.</p>
          <p>We'll notify you once they review your profile.</p>
        `,
      });
    } catch (err) {
      console.error('Failed to notify student:', err);
    }
  },
});


export const getById = query({
  args: { id: v.id('internshipApplications') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByInternship = query({
  args: { internshipId: v.id('internships') },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query('internshipApplications')
      .withIndex('by_internship', (q) => q.eq('internshipId', args.internshipId))
      .collect();

    return await Promise.all(
      applications.map(async (app) => {
        const student = await ctx.db.get(app.userId);
        return {
          ...app,
          studentName: student?.fullName,
          studentEmail: student?.email,
        };
      })
    );
  },
});

export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query('internshipApplications')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    return await Promise.all(
      applications.map(async (app) => {
        const internship = await ctx.db.get(app.internshipId);
        return {
          ...app,
          internshipTitle: internship?.title,
          status: app.status,
        };
      })
    );
  },
});
