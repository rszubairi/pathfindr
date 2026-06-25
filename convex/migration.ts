import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// ── Export queries (read all rows from source) ────────────────────────────────

export const exportUsers = query({ args: {}, handler: async (ctx) => ctx.db.query('users').collect() });
export const exportScholarships = query({ args: {}, handler: async (ctx) => ctx.db.query('scholarships').collect() });
export const exportAcademicProfiles = query({ args: {}, handler: async (ctx) => ctx.db.query('academicProfiles').collect() });
export const exportInstitutionProfiles = query({ args: {}, handler: async (ctx) => ctx.db.query('institutionProfiles').collect() });
export const exportBoardingSchools = query({ args: {}, handler: async (ctx) => ctx.db.query('boardingSchools').collect() });
export const exportInternationalSchools = query({ args: {}, handler: async (ctx) => ctx.db.query('internationalSchools').collect() });
export const exportUniversities = query({ args: {}, handler: async (ctx) => ctx.db.query('universities').collect() });
export const exportCourseCategories = query({ args: {}, handler: async (ctx) => ctx.db.query('courseCategories').collect() });
export const exportAchievements = query({ args: {}, handler: async (ctx) => ctx.db.query('achievements').collect() });
export const exportInvoiceCounter = query({ args: {}, handler: async (ctx) => ctx.db.query('invoiceCounter').collect() });
export const exportShortUrls = query({ args: {}, handler: async (ctx) => ctx.db.query('shortUrls').collect() });
export const exportPartnerProfiles = query({ args: {}, handler: async (ctx) => ctx.db.query('partnerProfiles').collect() });
export const exportEmailLogs = query({ args: {}, handler: async (ctx) => ctx.db.query('emailLogs').collect() });
export const exportInvoices = query({ args: {}, handler: async (ctx) => ctx.db.query('invoices').collect() });
export const exportKidProfiles = query({ args: {}, handler: async (ctx) => ctx.db.query('kidProfiles').collect() });
export const exportCourses = query({ args: {}, handler: async (ctx) => ctx.db.query('courses').collect() });
export const exportLessons = query({ args: {}, handler: async (ctx) => ctx.db.query('lessons').collect() });
export const exportAssessments = query({ args: {}, handler: async (ctx) => ctx.db.query('assessments').collect() });
export const exportReferrals = query({ args: {}, handler: async (ctx) => ctx.db.query('referrals').collect() });
export const exportScholarshipNotifications = query({ args: {}, handler: async (ctx) => ctx.db.query('scholarshipNotifications').collect() });
export const exportBoardingSchoolNotifications = query({ args: {}, handler: async (ctx) => ctx.db.query('boardingSchoolNotifications').collect() });
export const exportApplications = query({ args: {}, handler: async (ctx) => ctx.db.query('applications').collect() });
export const exportInternships = query({ args: {}, handler: async (ctx) => ctx.db.query('internships').collect() });
export const exportScholarshipFeaturePayments = query({ args: {}, handler: async (ctx) => ctx.db.query('scholarshipFeaturePayments').collect() });
export const exportCorporateDonations = query({ args: {}, handler: async (ctx) => ctx.db.query('corporateDonations').collect() });
export const exportInternshipPayments = query({ args: {}, handler: async (ctx) => ctx.db.query('internshipPayments').collect() });
export const exportSubscriptions = query({ args: {}, handler: async (ctx) => ctx.db.query('subscriptions').collect() });
export const exportReferralRewards = query({ args: {}, handler: async (ctx) => ctx.db.query('referralRewards').collect() });
export const exportDonatedSubscriptions = query({ args: {}, handler: async (ctx) => ctx.db.query('donatedSubscriptions').collect() });
export const exportInternshipApplications = query({ args: {}, handler: async (ctx) => ctx.db.query('internshipApplications').collect() });
export const exportCourseEnrollments = query({ args: {}, handler: async (ctx) => ctx.db.query('courseEnrollments').collect() });
export const exportAiTutorInteractions = query({ args: {}, handler: async (ctx) => ctx.db.query('aiTutorInteractions').collect() });
export const exportLearningSessions = query({ args: {}, handler: async (ctx) => ctx.db.query('learningSessions').collect() });
export const exportAssessmentResults = query({ args: {}, handler: async (ctx) => ctx.db.query('assessmentResults').collect() });
export const exportLeaderboard = query({ args: {}, handler: async (ctx) => ctx.db.query('leaderboard').collect() });
export const exportUserAchievements = query({ args: {}, handler: async (ctx) => ctx.db.query('userAchievements').collect() });
export const exportPartnerReferrals = query({ args: {}, handler: async (ctx) => ctx.db.query('partnerReferrals').collect() });

// ── Import mutations (insert rows into destination) ───────────────────────────

export const importUser = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('users', data),
});
export const importScholarship = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('scholarships', data),
});
export const importAcademicProfile = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('academicProfiles', data),
});
export const importInstitutionProfile = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('institutionProfiles', data),
});
export const importBoardingSchool = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('boardingSchools', data),
});
export const importInternationalSchool = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('internationalSchools', data),
});
export const importUniversity = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('universities', data),
});
export const importCourseCategory = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('courseCategories', data),
});
export const importAchievement = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('achievements', data),
});
export const importInvoiceCounter = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('invoiceCounter', data),
});
export const importShortUrl = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('shortUrls', data),
});
export const importPartnerProfile = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('partnerProfiles', data),
});
export const importEmailLog = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('emailLogs', data),
});
export const importInvoice = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('invoices', data),
});
export const importKidProfile = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('kidProfiles', data),
});
export const importCourse = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('courses', data),
});
export const importLesson = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('lessons', data),
});
export const importAssessment = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('assessments', data),
});
export const importReferral = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('referrals', data),
});
export const importScholarshipNotification = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('scholarshipNotifications', data),
});
export const importBoardingSchoolNotification = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('boardingSchoolNotifications', data),
});
export const importApplication = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('applications', data),
});
export const importInternship = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('internships', data),
});
export const importScholarshipFeaturePayment = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('scholarshipFeaturePayments', data),
});
export const importCorporateDonation = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('corporateDonations', data),
});
export const importInternshipPayment = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('internshipPayments', data),
});
export const importSubscription = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('subscriptions', data),
});
export const importReferralReward = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('referralRewards', data),
});
export const importDonatedSubscription = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('donatedSubscriptions', data),
});
export const importInternshipApplication = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('internshipApplications', data),
});
export const importCourseEnrollment = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('courseEnrollments', data),
});
export const importAiTutorInteraction = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('aiTutorInteractions', data),
});
export const importLearningSession = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('learningSessions', data),
});
export const importAssessmentResult = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('assessmentResults', data),
});
export const importLeaderboardEntry = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('leaderboard', data),
});
export const importUserAchievement = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('userAchievements', data),
});
export const importPartnerReferral = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => ctx.db.insert('partnerReferrals', data),
});

// ── Patch mutations for circular-dep resolution (subscriptions ↔ referralRewards) ──

export const patchSubscription = mutation({
  args: { id: v.id('subscriptions'), donationId: v.optional(v.id('corporateDonations')), referralRewardId: v.optional(v.id('referralRewards')) },
  handler: async (ctx, { id, donationId, referralRewardId }) => {
    const patch: Record<string, unknown> = {};
    if (donationId !== undefined) patch.donationId = donationId;
    if (referralRewardId !== undefined) patch.referralRewardId = referralRewardId;
    if (Object.keys(patch).length > 0) await ctx.db.patch(id, patch);
  },
});

export const patchReferralReward = mutation({
  args: { id: v.id('referralRewards'), subscriptionId: v.optional(v.id('subscriptions')) },
  handler: async (ctx, { id, subscriptionId }) => {
    if (subscriptionId !== undefined) await ctx.db.patch(id, { subscriptionId });
  },
});
