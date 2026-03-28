// User Types
export type UserRole = 'student' | 'institution' | 'philanthropist' | 'admin' | 'corporate';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eligibilityCriteria: Record<string, any>;
  description?: string;
  applicationUrl?: string;
  applicationCount?: number;
  matchScore?: number;
  status: 'active' | 'closed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionProfile {
  id: string;
  userId: string;
  institutionName: string;
  corporateIdentityNumber: string;
  picName: string;
  picEmail: string;
  picPhone: string;
  providerType: Scholarship['providerType'];
  website?: string;
  description?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScholarshipFilters {
  countries?: string[];
  fields?: string[];
  providerTypes?: string[];
  minValue?: number;
  maxValue?: number;
  deadlineWithinMonths?: number;
  status?: string;
}

// Boarding School Types
export interface BoardingSchool {
  _id: string;
  name: string;
  shortName?: string;
  category: 'SBP Premier' | 'SMS' | 'SBPI' | 'SMAP' | 'TMUA' | 'MRSM' | 'MRSM Premier';
  state: string;
  district: string;
  gender: 'male' | 'female' | 'mixed';
  entryLevels: string[];
  applicationPortal: string;
  applicationPeriod: string;
  description?: string;
  specialPrograms: string[];
  managedBy: 'KPM' | 'MARA';
  status: 'active' | 'closed' | 'upcoming';
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardingSchoolFilters {
  states?: string[];
  categories?: string[];
  gender?: string;
  entryLevel?: string;
  managedBy?: string;
}

// International School Types
export interface InternationalSchool {
  id: string;
  name: string;
  country: string;
  city: string;
  curriculum: string[];
  grades: string;
  annualFees: string;
  website: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface InternationalSchoolFilters {
  countries?: string[];
  curriculums?: string[];
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
