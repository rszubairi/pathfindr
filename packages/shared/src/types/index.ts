// User Types
export type UserRole = 'student' | 'institution' | 'philanthropist' | 'admin';
export type SubscriptionTier = 'pro' | 'expert';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  subscriptionTier?: SubscriptionTier;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// UAP Types
export interface PersonalDetails {
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  nationality: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface AcademicQualification {
  id: string;
  institutionName: string;
  qualificationTitle: string;
  qualificationType: 'spm' | 'stpm' | 'diploma' | 'bachelor' | 'master' | 'phd';
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  cgpa?: number;
}

export interface Activity {
  id: string;
  title: string;
  role: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievementLevel?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  documentUrl?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'publication' | 'presentation' | 'other';
  url?: string;
  date: string;
}

export interface CareerPreferences {
  interests: string[];
  preferredFields: string[];
  preferredCountries: string[];
  availabilityType: 'full-time' | 'part-time' | 'internship' | 'any';
  financialNeedCategory?: 'low' | 'medium' | 'high';
}

export interface UAP {
  id: string;
  userId: string;
  profileCompleteness: number;
  personalDetails: PersonalDetails;
  contactInfo: ContactInfo;
  academicQualifications: AcademicQualification[];
  activities: Activity[];
  awards: Award[];
  portfolio: PortfolioItem[];
  careerPreferences: CareerPreferences;
  personalStatement?: string;
  createdAt: string;
  updatedAt: string;
}

// Scholarship Types
export type ProviderType = 'government' | 'university' | 'corporate' | 'ngo' | 'foundation' | 'individual';
export type ScholarshipStatus = 'active' | 'closed' | 'pending' | 'draft';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  providerType: ProviderType;
  value: number;
  currency: string;
  eligibleFields: string[];
  eligibleCountries: string[];
  deadline: string;
  eligibilityCriteria: Record<string, any>;
  description: string;
  requirements: string[];
  applicationUrl?: string;
  matchScore?: number;
  status: ScholarshipStatus;
  createdAt: string;
  updatedAt: string;
}

// University Types
export interface University {
  id: string;
  name: string;
  logo?: string;
  description: string;
  location: {
    country: string;
    city: string;
    address?: string;
  };
  website?: string;
  verified: boolean;
  ranking?: number;
  createdAt: string;
  updatedAt: string;
}

export type ProgrammeLevel = 'diploma' | 'bachelor' | 'master' | 'phd';

export interface Programme {
  id: string;
  universityId: string;
  name: string;
  level: ProgrammeLevel;
  fieldOfStudy: string;
  duration: number;
  durationUnit: 'months' | 'years';
  tuitionFee: number;
  currency: string;
  intakeDates: string[];
  entryRequirements: Record<string, any>;
  description: string;
  suitabilityScore?: number;
  createdAt: string;
  updatedAt: string;
}

// Job/Internship Types
export type OpportunityType = 'internship' | 'graduate-programme' | 'entry-level' | 'part-time';
export type OpportunityStatus = 'active' | 'closed' | 'draft';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  company: string;
  companyLogo?: string;
  description: string;
  requirements: {
    skills: string[];
    qualifications: string[];
    cgpa?: number;
    experienceYears?: number;
  };
  location: string;
  locationType: 'on-site' | 'remote' | 'hybrid';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  duration?: string;
  deadline: string;
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
}

// Application Types
export type ApplicationStatus = 'applied' | 'under-review' | 'shortlisted' | 'rejected' | 'awarded' | 'withdrawn';
export type ApplicationType = 'scholarship' | 'programme' | 'job' | 'internship';

export interface Application {
  id: string;
  studentId: string;
  opportunityId: string;
  opportunityType: ApplicationType;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  autoApplied: boolean;
  documents: string[];
  notes?: string;
}

// Notification Types
export type NotificationType =
  | 'match'
  | 'status-update'
  | 'deadline'
  | 'auto-apply'
  | 'university-update'
  | 'job-alert'
  | 'profile-view'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  applicationsUsed: number;
  applicationsLimit: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

// ==========================================
// Learning App Types
// ==========================================

// Kid Profile Types
export interface KidProfile {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  grade: string;
  learningGoals?: string[];
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Course Category Types
export type CourseCategory = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  ageRange: { min: number; max: number };
  isActive: boolean;
  createdAt: string;
};

// Course Types
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  script: string;
  duration: number; // minutes
  ageRange: { min: number; max: number };
  difficulty: CourseDifficulty;
  language: string;
  tags: string[];
  learningObjectives: string[];
  prerequisites?: string[];
  status: CourseStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Lesson Types
export type BreakpointType = 'question' | 'hint' | 'summary' | 'activity';
export type LessonStatus = 'draft' | 'published' | 'archived';

export interface LessonBreakpoint {
  timestamp: number; // seconds
  type: BreakpointType;
  content: string;
  correctAnswer?: string;
  options?: string[];
  points?: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  sequenceOrder: number;
  videoUrl?: string;
  script: string;
  breakpoints: LessonBreakpoint[];
  duration: number; // minutes
  learningObjectives?: string[];
  status: LessonStatus;
  createdAt: string;
}

// Enrollment Types
export interface CompletedLesson {
  lessonId: string;
  completedAt: string;
  score?: number;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  kidProfileId: string;
  courseId: string;
  progress: number; // 0-100
  currentLessonIndex: number;
  completedLessons: CompletedLesson[];
  totalScore?: number;
  enrolledAt: string;
  completedAt?: string;
  lastAccessedAt?: string;
}

// AI Tutor Interaction Types
export type AIInteractionType = 'question' | 'hint' | 'correction' | 'encouragement' | 'explanation';

export interface AITutorInteraction {
  id: string;
  userId: string;
  kidProfileId: string;
  lessonId: string;
  breakpointIndex: number;
  interactionType: AIInteractionType;
  question?: string;
  userResponse?: string;
  aiResponse: string;
  isCorrect?: boolean;
  scoreDelta?: number;
  responseTimeMs?: number;
  hintsUsed?: number;
  createdAt: string;
}

// Assessment Types
export type AssessmentType = 'quiz' | 'midterm' | 'final' | 'practice';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
export type AssessmentStatus = 'draft' | 'published' | 'archived';

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: AssessmentType;
  passingScore: number; // percentage
  timeLimit?: number; // minutes
  questions: AssessmentQuestion[];
  totalPoints: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  attemptsAllowed?: number;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt: string;
}

// Assessment Result Types
export interface AssessmentAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  kidProfileId: string;
  assessmentId: string;
  courseId: string;
  answers: AssessmentAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds?: number;
  attemptNumber: number;
  completedAt: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  id: string;
  userId: string;
  kidProfileId: string;
  courseId: string;
  totalScore: number;
  completedAssessments: number;
  averageScore: number;
  rank: number;
  streak?: number;
  lastActivityAt: string;
  updatedAt: string;
}

// Achievement Types
export type AchievementCategory = 'completion' | 'streak' | 'score' | 'speed' | 'special';

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: string;
  points?: number;
  isActive: boolean;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  kidProfileId: string;
  achievementCode: string;
  courseId?: string;
  earnedAt: string;
  metadata?: Record<string, any>;
}

// Learning Progress Summary
export interface LearningProgress {
  enrolledCourses: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalScore: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  achievementsEarned: number;
  timeSpentMinutes: number;
}

// Course Catalog Filter Options
export interface CourseFilterOptions {
  categoryId?: string;
  difficulty?: CourseDifficulty[];
  ageRange?: { min?: number; max?: number };
  language?: string;
  tags?: string[];
  search?: string;
  status?: CourseStatus;
}

// Learning Dashboard Summary
export interface LearningDashboard {
  kidProfiles: KidProfile[];
  activeEnrollments: CourseEnrollment[];
  recentActivity: AITutorInteraction[];
  pendingAssessments: Assessment[];
  leaderboardPosition: LeaderboardEntry[];
  recentAchievements: UserAchievement[];
}
