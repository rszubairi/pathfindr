// User Role Constants
export const USER_ROLES = {
  STUDENT: 'student',
  INSTITUTION: 'institution',
  PHILANTHROPIST: 'philanthropist',
  ADMIN: 'admin',
} as const;

// Subscription Tier Constants
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
} as const;

// Application Status Constants
export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  UNDER_REVIEW: 'under-review',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  AWARDED: 'awarded',
  WITHDRAWN: 'withdrawn',
} as const;

// Notification Type Constants
export const NOTIFICATION_TYPES = {
  MATCH: 'match',
  STATUS_UPDATE: 'status-update',
  DEADLINE: 'deadline',
  AUTO_APPLY: 'auto-apply',
  UNIVERSITY_UPDATE: 'university-update',
  JOB_ALERT: 'job-alert',
  PROFILE_VIEW: 'profile-view',
  SYSTEM: 'system',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  AUTO_APPLY: process.env.ENABLE_AUTO_APPLY === 'true',
  AI_MATCHING: process.env.ENABLE_AI_MATCHING === 'true',
  BIOMETRIC_AUTH: process.env.ENABLE_BIOMETRIC_AUTH === 'true',
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,
  NAME_MAX_LENGTH: 100,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Currency Constants
export const CURRENCIES = {
  MYR: 'MYR',
  SGD: 'SGD',
  USD: 'USD',
  GBP: 'GBP',
  EUR: 'EUR',
} as const;

// Language Constants
export const LANGUAGES = {
  EN: 'en',
  MS: 'ms',
  ZH: 'zh',
  TA: 'ta',
} as const;

// Countries (ASEAN + Common Destinations)
export const COUNTRIES = {
  MALAYSIA: 'Malaysia',
  SINGAPORE: 'Singapore',
  INDONESIA: 'Indonesia',
  THAILAND: 'Thailand',
  VIETNAM: 'Vietnam',
  PHILIPPINES: 'Philippines',
  BRUNEI: 'Brunei',
  MYANMAR: 'Myanmar',
  CAMBODIA: 'Cambodia',
  LAOS: 'Laos',
  UK: 'United Kingdom',
  USA: 'United States',
  AUSTRALIA: 'Australia',
  CANADA: 'Canada',
  GERMANY: 'Germany',
  FRANCE: 'France',
  JAPAN: 'Japan',
  SOUTH_KOREA: 'South Korea',
  CHINA: 'China',
} as const;

// Academic Qualification Types
export const QUALIFICATION_TYPES = {
  SPM: 'spm',
  STPM: 'stpm',
  DIPLOMA: 'diploma',
  BACHELOR: 'bachelor',
  MASTER: 'master',
  PHD: 'phd',
} as const;

// Fields of Study (Common Categories)
export const FIELDS_OF_STUDY = [
  'Engineering',
  'Computer Science',
  'Medicine',
  'Business',
  'Law',
  'Education',
  'Arts & Humanities',
  'Science',
  'Social Sciences',
  'Architecture',
  'Design',
  'Agriculture',
  'Nursing',
  'Pharmacy',
  'Dentistry',
  'Accounting',
  'Finance',
  'Marketing',
  'Psychology',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Environmental Science',
  'Communications',
  'Journalism',
  'Economics',
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Insufficient permissions',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already exists',
  INVALID_TOKEN: 'Invalid or expired token',
  FILE_TOO_LARGE: 'File size exceeds maximum allowed',
  INVALID_FILE_TYPE: 'Invalid file type',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  APPLICATION_SUBMITTED: 'Application submitted successfully',
  PASSWORD_RESET_SENT: 'Password reset email sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
} as const;
