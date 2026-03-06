/**
 * Utility functions for Pathfindr
 */

// Validation Utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && password.length <= 128;
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// String Utilities
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Date Utilities
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-GB');
  }
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isDeadlineSoon = (deadline: string, daysThreshold: number = 7): boolean => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= daysThreshold && diffDays >= 0;
};

export const isDeadlinePassed = (deadline: string): boolean => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  return deadlineDate < today;
};

// Number Utilities
export const formatCurrency = (amount: number, currency: string = 'MYR'): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Array Utilities
export const unique = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

// Object Utilities
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

// File Utilities
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// UAP Utilities
export const calculateProfileCompleteness = (uap: any): number => {
  let score = 0;
  const maxScore = 100;

  // Personal details (20 points)
  if (uap.personalDetails?.fullName) score += 5;
  if (uap.personalDetails?.dateOfBirth) score += 5;
  if (uap.personalDetails?.nationality) score += 5;
  if (uap.personalDetails?.country) score += 5;

  // Contact info (15 points)
  if (uap.contactInfo?.email) score += 5;
  if (uap.contactInfo?.phone) score += 5;
  if (uap.contactInfo?.address) score += 5;

  // Academic qualifications (30 points)
  if (uap.academicQualifications?.length > 0) score += 30;

  // Activities (10 points)
  if (uap.activities?.length > 0) score += 10;

  // Awards (10 points)
  if (uap.awards?.length > 0) score += 10;

  // Career preferences (15 points)
  if (uap.careerPreferences?.interests?.length > 0) score += 15;

  return Math.min(score, maxScore);
};

// Matching Utilities
export const calculateMatchScore = (
  studentProfile: any,
  opportunity: any
): number => {
  // Basic matching algorithm (to be enhanced with AI)
  let score = 0;

  // Field of study match (40 points)
  if (studentProfile.careerPreferences?.interests?.some((interest: string) =>
    opportunity.eligibleFields?.includes(interest)
  )) {
    score += 40;
  }

  // Country match (30 points)
  if (studentProfile.careerPreferences?.preferredCountries?.some((country: string) =>
    opportunity.eligibleCountries?.includes(country)
  )) {
    score += 30;
  }

  // CGPA match (30 points)
  if (opportunity.eligibilityCriteria?.minCgpa) {
    const latestQualification = studentProfile.academicQualifications?.[0];
    if (latestQualification?.cgpa >= opportunity.eligibilityCriteria.minCgpa) {
      score += 30;
    }
  } else {
    score += 30; // No CGPA requirement
  }

  return Math.min(score, 100);
};
