import { query } from './_generated/server';
import { v } from 'convex/values';

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    // 1. Total registrations
    const totalRegistrations = await ctx.db.query('users').collect();
    
    // 2. Number of referrals
    const totalReferrals = await ctx.db.query('referrals').collect();
    
    // 3. Number of subscriptions (Active)
    const activeSubscriptions = await ctx.db
      .query('subscriptions')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();
      
    // 4. Number of donations by corporates
    const totalDonations = await ctx.db.query('corporateDonations').collect();
    
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
    };
  },
});
