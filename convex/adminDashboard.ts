import { query } from './_generated/server';
import { v } from 'convex/values';

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01T00:00:00.000Z`;

    // 1. Total registrations
    const totalRegistrations = await ctx.db.query('users').collect();
    
    // 2. Number of referrals
    const totalReferrals = await ctx.db.query('referrals').collect();
    
    // 3. Number of subscriptions (Active)
    const activeSubscriptions = await ctx.db
      .query('subscriptions')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();
      
    // Subscription Revenue (Current Year)
    const yearlySubscriptions = await ctx.db
      .query('subscriptions')
      .filter((q) => q.gte(q.field('createdAt'), startOfYear))
      .collect();

    const subscriptionRevenue = yearlySubscriptions.reduce((acc, sub) => {
      const amount = sub.tier === 'expert' ? 499 : 199;
      return acc + amount;
    }, 0);

    // 4. Number of donations by corporates
    const totalDonations = await ctx.db.query('corporateDonations').collect();

    // Donation Revenue (Current Year)
    const yearlyDonations = await ctx.db
      .query('corporateDonations')
      .filter((q) => q.gte(q.field('createdAt'), startOfYear))
      .collect();

    const donationRevenue = yearlyDonations.reduce((acc, donation) => {
      return acc + (donation.totalAmountPaid || 0);
    }, 0);
    
    // 5. Corporates registered
    const totalCorporates = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('role'), 'corporate'))
      .collect();

    // 6. Institutions (already in existing dashboard, but let's include for completeness)
    const totalInstitutions = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('role'), 'institution'))
      .collect();

    const pendingInstitutions = await ctx.db
      .query('institutionProfiles')
      .withIndex('by_approval_status', (q) => q.eq('approvalStatus', 'pending'))
      .collect();

    return {
      totalRegistrations: totalRegistrations.length,
      totalReferrals: totalReferrals.length,
      activeSubscriptions: activeSubscriptions.length,
      totalDonations: totalDonations.length,
      totalCorporates: totalCorporates.length,
      totalInstitutions: totalInstitutions.length,
      pendingInstitutions: pendingInstitutions.length,
      totalRevenue: subscriptionRevenue + donationRevenue,
      subscriptionRevenue,
      donationRevenue,
    };
  },
});
