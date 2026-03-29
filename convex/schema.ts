import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  scholarships: defineTable({
    name: v.string(),
    provider: v.string(),
    providerType: v.union(
      v.literal('government'),
      v.literal('university'),
      v.literal('corporate'),
      v.literal('ngo'),
      v.literal('foundation'),
      v.literal('individual')
    ),
    value: v.number(),
    currency: v.string(),
    eligibleFields: v.array(v.string()),
    eligibleCountries: v.array(v.string()),
    deadline: v.string(),
    eligibilityCriteria: v.any(),
    description: v.optional(v.string()),
    applicationUrl: v.optional(v.string()),
    applicationCount: v.optional(v.number()),
    matchScore: v.optional(v.number()),
    createdBy: v.optional(v.id('users')),
    viewCount: v.optional(v.number()),
    status: v.union(v.literal('active'), v.literal('closed'), v.literal('pending')),
    createdAt: v.string(),
    updatedAt: v.string(),
    localRanking: v.optional(v.number()),
    internationalRanking: v.optional(v.number()),
  })
    .index('by_status', ['status'])
    .index('by_deadline', ['deadline'])
    .index('by_value', ['value'])
    .index('by_created_at', ['createdAt'])
    .index('by_created_by', ['createdBy'])
    .searchIndex('search_name', {
      searchField: 'name',
      filterFields: ['status'],
    })
    .searchIndex('search_provider', {
      searchField: 'provider',
      filterFields: ['status'],
    }),

  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    fullName: v.string(),
    phone: v.string(),
    role: v.union(
      v.literal('student'),
      v.literal('institution'),
      v.literal('philanthropist'),
      v.literal('admin'),
      v.literal('corporate')
    ),
    emailVerified: v.boolean(),
    verificationToken: v.optional(v.string()),
    tokenExpiry: v.optional(v.number()),
    profileCompleted: v.boolean(),
    profileImageId: v.optional(v.id('_storage')),
    referralCode: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_email', ['email'])
    .index('by_verification_token', ['verificationToken'])
    .index('by_referral_code', ['referralCode']),

  academicProfiles: defineTable({
    userId: v.id('users'),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.string()),
    nationality: v.optional(v.string()),
    country: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    phone: v.optional(v.string()),
    education: v.array(
      v.object({
        id: v.string(),
        institutionName: v.string(),
        qualificationTitle: v.string(),
        fieldOfStudy: v.string(),
        startDate: v.string(),
        endDate: v.optional(v.string()),
        grade: v.optional(v.string()),
        gpa: v.optional(v.number()),
      })
    ),
    testScores: v.object({
      sat: v.optional(v.number()),
      ielts: v.optional(v.number()),
      toefl: v.optional(v.number()),
      gre: v.optional(v.number()),
      gmat: v.optional(v.number()),
    }),
    certificates: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        issuer: v.string(),
        dateIssued: v.string(),
      })
    ),
    projects: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        technologies: v.array(v.string()),
        startDate: v.string(),
        endDate: v.optional(v.string()),
      })
    ),
    skills: v.array(v.string()),
    interests: v.array(v.string()),
    preferredCountries: v.array(v.string()),
    availability: v.optional(v.string()),
    profileStatus: v.union(
      v.literal('incomplete'),
      v.literal('pending_review'),
      v.literal('verified')
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_user_id', ['userId'])
    .index('by_profile_status', ['profileStatus']),

  institutionProfiles: defineTable({
    userId: v.id('users'),
    institutionName: v.string(),
    corporateIdentityNumber: v.string(),
    picName: v.string(),
    picEmail: v.string(),
    picPhone: v.string(),
    providerType: v.union(
      v.literal('government'),
      v.literal('university'),
      v.literal('corporate'),
      v.literal('ngo'),
      v.literal('foundation'),
      v.literal('individual')
    ),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    address: v.optional(v.string()),
    approvalStatus: v.union(
      v.literal('pending'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    approvedBy: v.optional(v.id('users')),
    approvedAt: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_user_id', ['userId'])
    .index('by_approval_status', ['approvalStatus'])
    .index('by_corporate_id', ['corporateIdentityNumber']),

  subscriptions: defineTable({
    userId: v.id('users'),
    tier: v.union(v.literal('pro'), v.literal('expert')),
    status: v.union(
      v.literal('active'),
      v.literal('canceled'),
      v.literal('past_due'),
      v.literal('incomplete')
    ),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    currentPeriodStart: v.string(),
    currentPeriodEnd: v.string(),
    cancelAtPeriodEnd: v.boolean(),
    applicationsUsed: v.number(),
    applicationsLimit: v.number(),
    isDonated: v.optional(v.boolean()),
    donatedBy: v.optional(v.id('users')),
    donationId: v.optional(v.id('corporateDonations')),
    isReferralReward: v.optional(v.boolean()),
    referralRewardId: v.optional(v.id('referralRewards')),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_user_id', ['userId'])
    .index('by_stripe_subscription_id', ['stripeSubscriptionId'])
    .index('by_stripe_customer_id', ['stripeCustomerId'])
    .index('by_status', ['status']),

  boardingSchools: defineTable({
    name: v.string(),
    shortName: v.optional(v.string()),
    category: v.union(
      v.literal('SBP Premier'),
      v.literal('SMS'),
      v.literal('SBPI'),
      v.literal('SMAP'),
      v.literal('TMUA'),
      v.literal('MRSM'),
      v.literal('MRSM Premier')
    ),
    state: v.string(),
    district: v.string(),
    gender: v.union(v.literal('male'), v.literal('female'), v.literal('mixed')),
    entryLevels: v.array(v.string()),
    applicationPortal: v.string(),
    applicationPeriod: v.string(),
    description: v.optional(v.string()),
    specialPrograms: v.array(v.string()),
    managedBy: v.union(v.literal('KPM'), v.literal('MARA')),
    status: v.union(v.literal('active'), v.literal('closed'), v.literal('upcoming')),
    deadline: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_category', ['category'])
    .index('by_state', ['state'])
    .index('by_status', ['status'])
    .index('by_managed_by', ['managedBy'])
    .searchIndex('search_name', {
      searchField: 'name',
      filterFields: ['category', 'state'],
    }),

  scholarshipNotifications: defineTable({
    userId: v.id('users'),
    scholarshipId: v.id('scholarships'),
    email: v.string(),
    notified: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_user_and_scholarship', ['userId', 'scholarshipId'])
    .index('by_scholarship_id', ['scholarshipId'])
    .index('by_user_id', ['userId']),

  boardingSchoolNotifications: defineTable({
    userId: v.id('users'),
    schoolId: v.id('boardingSchools'),
    email: v.string(),
    createdAt: v.string(),
  })
    .index('by_user_id', ['userId'])
    .index('by_school_id', ['schoolId'])
    .index('by_user_and_school', ['userId', 'schoolId']),

  internationalSchools: defineTable({
    name: v.string(),
    country: v.string(),
    city: v.string(),
    curriculum: v.array(v.string()),
    grades: v.string(),
    annualFees: v.string(),
    website: v.string(),
    description: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    status: v.union(v.literal('active'), v.literal('closed')),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_country', ['country'])
    .index('by_status', ['status'])
    .searchIndex('search_name', {
      searchField: 'name',
      filterFields: ['country'],
    }),

  applications: defineTable({
    userId: v.id('users'),
    scholarshipId: v.id('scholarships'),
    status: v.union(
      v.literal('applied'),
      v.literal('under_review'),
      v.literal('shortlisted'),
      v.literal('rejected'),
      v.literal('awarded'),
      v.literal('withdrawn')
    ),
    appliedAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_user_id', ['userId'])
    .index('by_scholarship_id', ['scholarshipId'])
    .index('by_user_and_scholarship', ['userId', 'scholarshipId']),

  internships: defineTable({
    companyId: v.id('institutionProfiles'),
    title: v.string(),
    description: v.string(),
    location: v.string(),
    type: v.union(v.literal('full-time'), v.literal('part-time'), v.literal('remote')),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
    salaryRange: v.optional(v.string()),
    duration: v.optional(v.string()),
    deadline: v.string(),
    status: v.union(
      v.literal('draft'),
      v.literal('pending_payment'),
      v.literal('active'),
      v.literal('closed')
    ),
    paymentStatus: v.union(v.literal('unpaid'), v.literal('paid')),
    listingPrice: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_company', ['companyId'])
    .index('by_status', ['status'])
    .index('by_payment_status', ['paymentStatus']),

  internshipApplications: defineTable({
    internshipId: v.id('internships'),
    userId: v.id('users'),
    status: v.union(
      v.literal('applied'),
      v.literal('under_review'),
      v.literal('shortlisted'),
      v.literal('rejected'),
      v.literal('accepted')
    ),
    appliedAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_internship', ['internshipId'])
    .index('by_user', ['userId'])
    .index('by_internship_and_user', ['internshipId', 'userId']),

  internshipPayments: defineTable({
    companyId: v.id('institutionProfiles'),
    internshipIds: v.array(v.id('internships')),
    amount: v.number(),
    currency: v.string(),
    status: v.union(v.literal('pending'), v.literal('completed'), v.literal('failed')),
    stripePaymentIntentId: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index('by_company', ['companyId'])
    .index('by_stripe_id', ['stripePaymentIntentId']),

  corporateDonations: defineTable({
    corporateUserId: v.id('users'),
    companyId: v.id('institutionProfiles'),
    tier: v.union(v.literal('pro'), v.literal('expert')),
    quantityPurchased: v.number(),
    quantityAssigned: v.number(),
    quantityRemaining: v.number(),
    totalAmountPaid: v.number(),
    currency: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    stripeCheckoutSessionId: v.optional(v.string()),
    couponCode: v.string(),
    status: v.union(
      v.literal('pending'),
      v.literal('completed'),
      v.literal('exhausted')
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_corporate_user', ['corporateUserId'])
    .index('by_company', ['companyId'])
    .index('by_coupon_code', ['couponCode'])
    .index('by_status', ['status']),

  donatedSubscriptions: defineTable({
    donationId: v.id('corporateDonations'),
    corporateUserId: v.id('users'),
    studentUserId: v.id('users'),
    subscriptionId: v.id('subscriptions'),
    claimMethod: v.union(
      v.literal('auto_assigned'),
      v.literal('coupon_claimed')
    ),
    couponCode: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index('by_donation', ['donationId'])
    .index('by_corporate_user', ['corporateUserId'])
    .index('by_student_user', ['studentUserId']),

  referrals: defineTable({
    referrerUserId: v.id('users'),
    referredUserId: v.id('users'),
    status: v.union(v.literal('registered'), v.literal('rewarded')),
    createdAt: v.string(),
  })
    .index('by_referrer', ['referrerUserId'])
    .index('by_referred', ['referredUserId'])
    .index('by_referrer_and_status', ['referrerUserId', 'status']),

  referralRewards: defineTable({
    referrerUserId: v.id('users'),
    rewardType: v.union(
      v.literal('self_subscription'),
      v.literal('coupon')
    ),
    subscriptionId: v.optional(v.id('subscriptions')),
    couponCode: v.optional(v.string()),
    couponStatus: v.optional(
      v.union(v.literal('available'), v.literal('claimed'))
    ),
    couponClaimedBy: v.optional(v.id('users')),
    couponClaimedAt: v.optional(v.string()),
    referralIds: v.array(v.id('referrals')),
    createdAt: v.string(),
  })
    .index('by_referrer', ['referrerUserId'])
    .index('by_coupon_code', ['couponCode'])
    .index('by_coupon_status', ['couponStatus']),

});
