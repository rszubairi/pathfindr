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
    isFeatured: v.optional(v.boolean()),
    featuredUntil: v.optional(v.string()),
  })
    .index('by_status', ['status'])
    .index('by_featured', ['isFeatured'])
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
      v.literal('corporate'),
      v.literal('partner')
    ),
    emailVerified: v.boolean(),
    verificationToken: v.optional(v.string()),
    tokenExpiry: v.optional(v.number()),
    resetPasswordToken: v.optional(v.string()),
    resetPasswordTokenExpiry: v.optional(v.number()),
    profileCompleted: v.boolean(),
    profileImageId: v.optional(v.id('_storage')),
    referralCode: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_email', ['email'])
    .index('by_verification_token', ['verificationToken'])
    .index('by_reset_password_token', ['resetPasswordToken'])
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
    subjectScores: v.optional(v.array(v.object({
      id: v.string(),
      examType: v.union(v.literal('IGCSE'), v.literal('SPM'), v.literal('O-Level')),
      year: v.optional(v.string()),
      subjects: v.array(v.object({
        subject: v.string(),
        grade: v.string(),
      })),
    }))),
    extracurriculars: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      category: v.union(
        v.literal('sports'),
        v.literal('arts'),
        v.literal('leadership'),
        v.literal('community'),
        v.literal('academic_club'),
        v.literal('cultural'),
        v.literal('other')
      ),
      role: v.string(),
      educationLevel: v.union(
        v.literal('school'),
        v.literal('college'),
        v.literal('university')
      ),
      startDate: v.string(),
      endDate: v.optional(v.string()),
      description: v.optional(v.string()),
      achievement: v.optional(v.string()),
    }))),
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
  emailLogs: defineTable({
    recipientEmail: v.string(),
    subject: v.string(),
    body: v.string(),
    sentAt: v.string(),
    userId: v.optional(v.id('users')),
    type: v.string(), // e.g., 'verification', 'subscription_success', etc.
    status: v.union(v.literal('sent'), v.literal('failed')),
    error: v.optional(v.string()),
  })
    .index('by_recipient', ['recipientEmail'])
    .index('by_sent_at', ['sentAt'])
    .index('by_user_id', ['userId']),

  scholarshipFeaturePayments: defineTable({
    corporateUserId: v.id('users'),
    scholarshipId: v.id('scholarships'),
    amount: v.number(),
    currency: v.string(),
    status: v.union(v.literal('pending'), v.literal('completed'), v.literal('failed')),
    stripePaymentIntentId: v.optional(v.string()),
    stripeCheckoutSessionId: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_corporate_user', ['corporateUserId'])
    .index('by_scholarship', ['scholarshipId']),

  shortUrls: defineTable({
    shortCode: v.string(),
    targetPath: v.string(),
    type: v.union(v.literal('university'), v.literal('scholarship'), v.literal('other')),
    createdAt: v.string(),
  })
    .index('by_shortCode', ['shortCode'])
    .index('by_targetPath', ['targetPath']),

  universities: defineTable({
    name: v.string(),
    country: v.string(),
    city: v.optional(v.string()),
    worldRanking: v.optional(v.number()),
    localRanking: v.optional(v.number()),
    website: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.union(v.literal('public'), v.literal('private'), v.literal('branch')),
    status: v.union(v.literal('active'), v.literal('closed')),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_country', ['country'])
    .index('by_name', ['name'])
    .index('by_world_ranking', ['worldRanking'])
    .index('by_local_ranking', ['localRanking'])
    .searchIndex('search_name', {
      searchField: 'name',
      filterFields: ['country'],
    }),

  // ==========================================
  // Learning App Tables
  // ==========================================

  // Kid Profiles - allows a user to manage multiple children's learning
  kidProfiles: defineTable({
    userId: v.id('users'),
    name: v.string(),
    dateOfBirth: v.string(),
    grade: v.string(),
    learningGoals: v.optional(v.array(v.string())),
    avatarUrl: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_name', ['userId', 'name']),

  // Course Categories - organize courses by subject/age
  courseCategories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    order: v.number(),
    ageRange: v.object({ min: v.number(), max: v.number() }),
    isActive: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_order', ['order'])
    .index('by_active', ['isActive']),

  // Courses - main learning content
  courses: defineTable({
    categoryId: v.id('courseCategories'),
    title: v.string(),
    description: v.string(),
    thumbnailUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    script: v.string(), // Full script for AI tutor
    duration: v.number(), // Total duration in minutes
    ageRange: v.object({ min: v.number(), max: v.number() }),
    difficulty: v.union(v.literal('beginner'), v.literal('intermediate'), v.literal('advanced')),
    language: v.string(),
    tags: v.array(v.string()),
    learningObjectives: v.array(v.string()),
    prerequisites: v.optional(v.array(v.string())),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    publishedAt: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_category', ['categoryId'])
    .index('by_status', ['status'])
    .index('by_age_range', ['ageRange'])
    .index('by_difficulty', ['difficulty'])
    .index('by_language', ['language'])
    .index('by_tags', ['tags'])
    .searchIndex('search_title', {
      searchField: 'title',
      filterFields: ['status', 'categoryId'],
    }),

  // Lessons - individual lesson units within a course
  lessons: defineTable({
    courseId: v.id('courses'),
    title: v.string(),
    description: v.optional(v.string()),
    sequenceOrder: v.number(),
    videoUrl: v.optional(v.string()),
    script: v.string(), // Lesson-specific script
    breakpoints: v.array(v.object({
      timestamp: v.number(), // Seconds into video
      type: v.union(v.literal('question'), v.literal('hint'), v.literal('summary'), v.literal('activity')),
      content: v.string(),
      correctAnswer: v.optional(v.string()),
      options: v.optional(v.array(v.string())),
      points: v.optional(v.number()),
    })),
    duration: v.number(), // Duration in minutes
    learningObjectives: v.optional(v.array(v.string())),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    createdAt: v.string(),
  })
    .index('by_course', ['courseId'])
    .index('by_sequence', ['courseId', 'sequenceOrder'])
    .index('by_status', ['status']),

  // Course Enrollments - track user/kid progress in courses
  courseEnrollments: defineTable({
    userId: v.id('users'),
    kidProfileId: v.id('kidProfiles'),
    courseId: v.id('courses'),
    progress: v.number(), // 0-100 percentage
    currentLessonIndex: v.number(),
    completedLessons: v.array(v.object({
      lessonId: v.id('lessons'),
      completedAt: v.string(),
      score: v.optional(v.number()),
      revisionCount: v.optional(v.number()), // Track how many times they revisited
    })),
    totalScore: v.optional(v.number()),
    totalTimeSpent: v.optional(v.number()), // Total time in seconds
    enrolledAt: v.string(),
    completedAt: v.optional(v.string()),
    lastAccessedAt: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_kid', ['kidProfileId'])
    .index('by_course', ['courseId'])
    .index('by_user_and_course', ['userId', 'courseId'])
    .index('by_kid_and_course', ['kidProfileId', 'courseId']),

  // AI Tutor Interactions - log all AI tutor engagements
  aiTutorInteractions: defineTable({
    userId: v.id('users'),
    kidProfileId: v.id('kidProfiles'),
    lessonId: v.id('lessons'),
    breakpointIndex: v.optional(v.number()), 
    interactionType: v.union(v.literal('question'), v.literal('hint'), v.literal('correction'), v.literal('encouragement'), v.literal('explanation'), v.literal('student_question')),
    initiatedBy: v.union(v.literal('student'), v.literal('system')),
    question: v.optional(v.string()),
    userResponse: v.optional(v.string()),
    aiResponse: v.string(),
    isCorrect: v.optional(v.boolean()),
    scoreDelta: v.optional(v.number()),
    responseTimeMs: v.optional(v.number()),
    hintsUsed: v.optional(v.number()),
    createdAt: v.string(),
  })
    .index('by_lesson', ['lessonId'])
    .index('by_kid', ['kidProfileId'])
    .index('by_kid_and_lesson', ['kidProfileId', 'lessonId']),

  // Learning Sessions - track time and engagement per session
  learningSessions: defineTable({
    userId: v.id('users'),
    kidProfileId: v.id('kidProfiles'),
    courseId: v.id('courses'),
    lessonId: v.id('lessons'),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    durationSeconds: v.number(),
    platform: v.string(), // ios, android, web
  })
    .index('by_kid', ['kidProfileId'])
    .index('by_course', ['courseId'])
    .index('by_lesson', ['lessonId']),

  // Assessments - quizzes and exams for courses
  assessments: defineTable({
    courseId: v.id('courses'),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal('quiz'), v.literal('midterm'), v.literal('final'), v.literal('practice')),
    passingScore: v.number(), // Percentage required to pass
    timeLimit: v.optional(v.number()), // Minutes, null for untimed
    questions: v.array(v.object({
      id: v.string(),
      question: v.string(),
      type: v.union(v.literal('multiple_choice'), v.literal('true_false'), v.literal('short_answer'), v.literal('essay')),
      options: v.optional(v.array(v.string())),
      correctAnswer: v.string(),
      points: v.number(),
      explanation: v.optional(v.string()),
    })),
    totalPoints: v.number(),
    shuffleQuestions: v.boolean(),
    shuffleOptions: v.boolean(),
    attemptsAllowed: v.optional(v.number()), // null for unlimited
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_course', ['courseId'])
    .index('by_type', ['type'])
    .index('by_status', ['status']),

  // Assessment Results - store user assessment submissions
  assessmentResults: defineTable({
    userId: v.id('users'),
    kidProfileId: v.id('kidProfiles'),
    assessmentId: v.id('assessments'),
    courseId: v.id('courses'),
    answers: v.array(v.object({
      questionId: v.string(),
      answer: v.string(),
      isCorrect: v.boolean(),
      pointsEarned: v.number(),
    })),
    score: v.number(),
    totalPoints: v.number(),
    percentage: v.number(),
    passed: v.boolean(),
    timeSpentSeconds: v.optional(v.number()),
    attemptNumber: v.number(),
    completedAt: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_kid', ['kidProfileId'])
    .index('by_assessment', ['assessmentId'])
    .index('by_course', ['courseId'])
    .index('by_user_and_course', ['userId', 'courseId'])
    .index('by_kid_and_course', ['kidProfileId', 'courseId'])
    .index('by_completed_at', ['completedAt']),

  // Leaderboard - ranking system for courses
  leaderboard: defineTable({
    userId: v.id('users'),
    kidProfileId: v.id('kidProfiles'),
    courseId: v.id('courses'),
    totalScore: v.number(),
    completedAssessments: v.number(),
    averageScore: v.number(),
    rank: v.number(),
    streak: v.optional(v.number()), // Current learning streak
    lastActivityAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_course', ['courseId'])
    .index('by_user', ['userId'])
    .index('by_kid', ['kidProfileId'])
    .index('by_course_and_score', ['courseId', 'totalScore'])
    .index('by_updated_at', ['updatedAt']),

  // Learning Achievements - badges and milestones
  achievements: defineTable({
    code: v.string(),
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    category: v.union(v.literal('completion'), v.literal('streak'), v.literal('score'), v.literal('speed'), v.literal('special')),
    requirement: v.string(), // Description of what's needed
    points: v.optional(v.number()),
    isActive: v.boolean(),
    createdAt: v.string(),
  })
    .index('by_code', ['code'])
    .index('by_category', ['category'])
    .index('by_active', ['isActive']),

  // User Achievements - track earned achievements
  userAchievements: defineTable({
    userId: v.id('users'),
    kidProfileId: v.id('kidProfiles'),
    achievementCode: v.string(),
    courseId: v.optional(v.id('courses')),
    earnedAt: v.string(),
    metadata: v.optional(v.any()),
  })
    .index('by_user', ['userId'])
    .index('by_kid', ['kidProfileId'])
    .index('by_achievement', ['achievementCode'])
    .index('by_user_and_course', ['userId', 'courseId']),

  // ==========================================
  // Partner Tables
  // ==========================================

  // Partner Profiles - submitted during registration (no userId until approved)
  partnerProfiles: defineTable({
    userId: v.optional(v.id('users')), // Set when admin approves and creates user account
    partnerType: v.union(v.literal('individual'), v.literal('company')),
    companyName: v.optional(v.string()), // Required for company type
    personInChargeName: v.string(),
    location: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(), // Login email; also used before user account is created
    website: v.optional(v.string()),
    partnerCode: v.string(), // Unique code partners share with students
    commissionPercentage: v.optional(v.number()), // Set by admin
    approvalStatus: v.union(
      v.literal('pending'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    approvedBy: v.optional(v.id('users')),
    approvedAt: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    adminNotes: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index('by_user_id', ['userId'])
    .index('by_email', ['email'])
    .index('by_partner_code', ['partnerCode'])
    .index('by_approval_status', ['approvalStatus']),

  // Partner Referrals - tracks students who registered using a partner code
  partnerReferrals: defineTable({
    partnerProfileId: v.id('partnerProfiles'),
    partnerUserId: v.optional(v.id('users')), // Partner user account id (once approved)
    studentUserId: v.id('users'),
    partnerCode: v.string(),
    createdAt: v.string(),
  })
    .index('by_partner_profile', ['partnerProfileId'])
    .index('by_partner_user', ['partnerUserId'])
    .index('by_student', ['studentUserId'])
    .index('by_partner_code', ['partnerCode']),

});
