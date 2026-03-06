// User Types
export type UserRole = 'student' | 'institution' | 'philanthropist' | 'admin';
export type SubscriptionTier = 'free' | 'premium';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  subscriptionTier?: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

// Scholarship Types
export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  providerType: 'government' | 'university' | 'corporate' | 'ngo' | 'foundation' | 'individual';
  value: number;
  currency: string;
  eligibleFields: string[];
  eligibleCountries: string[];
  deadline: string;
  eligibilityCriteria: Record<string, any>;
  matchScore?: number;
  status: 'active' | 'closed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

// University Types
export interface University {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: {
    country: string;
    city: string;
  };
  programmes: Programme[];
  verified: boolean;
}

export interface Programme {
  id: string;
  universityId: string;
  name: string;
  level: 'diploma' | 'bachelor' | 'master' | 'phd';
  fieldOfStudy: string;
  duration: number;
  tuitionFee: number;
  currency: string;
  intakeDates: string[];
  entryRequirements: Record<string, any>;
  suitabilityScore?: number;
}

// Job/Internship Types
export interface Opportunity {
  id: string;
  title: string;
  type: 'internship' | 'graduate-programme' | 'entry-level' | 'part-time';
  company: string;
  description: string;
  requirements: {
    skills: string[];
    qualifications: string[];
    cgpa?: number;
  };
  location: string;
  duration?: string;
  deadline: string;
  status: 'active' | 'closed';
}

// Application Types
export interface Application {
  id: string;
  studentId: string;
  opportunityId: string;
  opportunityType: 'scholarship' | 'programme' | 'job' | 'internship';
  status: 'applied' | 'under-review' | 'shortlisted' | 'rejected' | 'awarded';
  submittedAt: string;
  updatedAt: string;
  autoApplied: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'status-update' | 'deadline' | 'auto-apply' | 'university-update' | 'job-alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
