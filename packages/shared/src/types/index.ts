// User Types
export type UserRole = 'student' | 'institution' | 'philanthropist' | 'admin';
export type SubscriptionTier = 'free' | 'premium';
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
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  paymentMethod?: string;
  stripeSubscriptionId?: string;
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
