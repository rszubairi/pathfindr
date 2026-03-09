export const TIER_CONFIG = {
  pro: {
    name: 'Pro',
    price: 29,
    currency: 'USD',
    interval: 'year' as const,
    applicationsLimit: 5,
    features: [
      'Apply to 5 scholarships per year',
      'Full scholarship details & eligibility',
      'Application tracking dashboard',
      'Email notifications for deadlines',
    ],
  },
  expert: {
    name: 'Expert',
    price: 79,
    currency: 'USD',
    interval: 'year' as const,
    applicationsLimit: 20,
    features: [
      'Apply to 20 scholarships per year',
      'Full scholarship details & eligibility',
      'Application tracking dashboard',
      'Email notifications for deadlines',
      'Priority support',
      'Scholarship match recommendations',
    ],
    popular: true,
  },
} as const;

export type TierKey = keyof typeof TIER_CONFIG;
