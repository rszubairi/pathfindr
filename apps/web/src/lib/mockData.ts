import type { Scholarship } from '../types';

/**
 * Mock scholarship data for development
 * This will be replaced with real API calls when backend is ready
 */

const countries = [
  'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines',
  'United Kingdom', 'United States', 'Australia', 'Canada', 'Germany', 'France',
  'Japan', 'South Korea', 'China', 'New Zealand'
];

const fields = [
  'Engineering', 'Computer Science', 'Medicine', 'Business Administration',
  'Law', 'Education', 'Arts & Humanities', 'Science', 'Social Sciences',
  'Architecture', 'Design', 'Agriculture', 'Nursing', 'Pharmacy', 'Dentistry',
  'Accounting', 'Finance', 'Marketing', 'Psychology', 'Mathematics',
  'Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Communications'
];

const providerTypes: Array<'government' | 'university' | 'corporate' | 'ngo' | 'foundation' | 'individual'> = [
  'government', 'university', 'corporate', 'ngo', 'foundation', 'individual'
];

const currencies = ['USD', 'SGD', 'MYR', 'GBP', 'EUR', 'AUD'];

// Helper to generate random date in the future
const getRandomFutureDate = (minMonths: number, maxMonths: number): string => {
  const today = new Date();
  const months = Math.floor(Math.random() * (maxMonths - minMonths + 1)) + minMonths;
  const futureDate = new Date(today);
  futureDate.setMonth(futureDate.getMonth() + months);
  return futureDate.toISOString();
};

// Helper to get random items from array
const getRandomItems = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const mockScholarships: Scholarship[] = [
  // Southeast Asian Government Scholarships
  {
    id: 'sch-001',
    name: 'ASEAN Undergraduate Scholarship',
    provider: 'Singapore Ministry of Education',
    providerType: 'government',
    value: 25000,
    currency: 'SGD',
    eligibleFields: ['Engineering', 'Computer Science', 'Science', 'Medicine'],
    eligibleCountries: ['Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines'],
    deadline: getRandomFutureDate(2, 6),
    eligibilityCriteria: {
      minCgpa: 3.5,
      maxAge: 25,
      educationLevel: 'undergraduate'
    },
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'sch-002',
    name: 'Malaysia International Scholarship',
    provider: 'Malaysian Government',
    providerType: 'government',
    value: 15000,
    currency: 'MYR',
    eligibleFields: ['Engineering', 'Medicine', 'Science', 'Business Administration'],
    eligibleCountries: ['Malaysia'],
    deadline: getRandomFutureDate(1, 4),
    eligibilityCriteria: {
      minCgpa: 3.3,
      maxAge: 30,
      educationLevel: 'postgraduate'
    },
    status: 'active',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'sch-003',
    name: 'Thailand Excellence Scholarship',
    provider: 'Thailand Ministry of Higher Education',
    providerType: 'government',
    value: 20000,
    currency: 'USD',
    eligibleFields: ['Engineering', 'Science', 'Agriculture', 'Environmental Science'],
    eligibleCountries: ['Thailand'],
    deadline: getRandomFutureDate(3, 7),
    eligibilityCriteria: {
      minCgpa: 3.4,
      maxAge: 28,
      educationLevel: 'undergraduate'
    },
    status: 'active',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z'
  },

  // University Scholarships
  {
    id: 'sch-004',
    name: 'NUS Merit Scholarship',
    provider: 'National University of Singapore',
    providerType: 'university',
    value: 30000,
    currency: 'SGD',
    eligibleFields: ['Computer Science', 'Engineering', 'Business Administration', 'Law'],
    eligibleCountries: ['Singapore'],
    deadline: getRandomFutureDate(2, 5),
    eligibilityCriteria: {
      minCgpa: 3.8,
      maxAge: 23,
      educationLevel: 'undergraduate'
    },
    status: 'active',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z'
  },
  {
    id: 'sch-005',
    name: 'Universiti Malaya Research Scholarship',
    provider: 'Universiti Malaya',
    providerType: 'university',
    value: 18000,
    currency: 'MYR',
    eligibleFields: ['Science', 'Medicine', 'Engineering', 'Social Sciences'],
    eligibleCountries: ['Malaysia'],
    deadline: getRandomFutureDate(4, 8),
    eligibilityCriteria: {
      minCgpa: 3.5,
      maxAge: 35,
      educationLevel: 'postgraduate'
    },
    status: 'active',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z'
  },

  // Corporate Scholarships
  {
    id: 'sch-006',
    name: 'Google Asia Pacific Scholarship',
    provider: 'Google',
    providerType: 'corporate',
    value: 50000,
    currency: 'USD',
    eligibleFields: ['Computer Science', 'Engineering', 'Mathematics'],
    eligibleCountries: countries,
    deadline: getRandomFutureDate(3, 6),
    eligibilityCriteria: {
      minCgpa: 3.6,
      maxAge: 30,
      educationLevel: 'undergraduate'
    },
    status: 'active',
    createdAt: '2026-02-05T00:00:00Z',
    updatedAt: '2026-02-05T00:00:00Z'
  },
  {
    id: 'sch-007',
    name: 'Microsoft Future Leaders Scholarship',
    provider: 'Microsoft Corporation',
    providerType: 'corporate',
    value: 40000,
    currency: 'USD',
    eligibleFields: ['Computer Science', 'Engineering', 'Business Administration'],
    eligibleCountries: ['Singapore', 'Malaysia', 'Philippines', 'Indonesia', 'United States'],
    deadline: getRandomFutureDate(2, 4),
    eligibilityCriteria: {
      minCgpa: 3.7,
      maxAge: 25,
      educationLevel: 'undergraduate'
    },
    status: 'active',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-10T00:00:00Z'
  },

  // NGO & Foundation Scholarships
  {
    id: 'sch-008',
    name: 'Asia Foundation Women in STEM Scholarship',
    provider: 'The Asia Foundation',
    providerType: 'ngo',
    value: 15000,
    currency: 'USD',
    eligibleFields: ['Engineering', 'Computer Science', 'Science', 'Mathematics'],
    eligibleCountries: ['Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia'],
    deadline: getRandomFutureDate(1, 3),
    eligibilityCriteria: {
      minCgpa: 3.3,
      maxAge: 28,
      educationLevel: 'undergraduate',
      gender: 'female'
    },
    status: 'active',
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-01-25T00:00:00Z'
  },
  {
    id: 'sch-009',
    name: 'Fulbright Southeast Asia Scholarship',
    provider: 'Fulbright Commission',
    providerType: 'ngo',
    value: 35000,
    currency: 'USD',
    eligibleFields: fields,
    eligibleCountries: ['United States'],
    deadline: getRandomFutureDate(5, 9),
    eligibilityCriteria: {
      minCgpa: 3.5,
      maxAge: 35,
      educationLevel: 'postgraduate'
    },
    status: 'active',
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z'
  },

  // Individual/Philanthropist Scholarships
  {
    id: 'sch-010',
    name: 'Lee Kuan Yew Scholarship',
    provider: 'Lee Kuan Yew Foundation',
    providerType: 'individual',
    value: 28000,
    currency: 'SGD',
    eligibleFields: ['Law', 'Business Administration', 'Political Science', 'Social Sciences'],
    eligibleCountries: ['Singapore'],
    deadline: getRandomFutureDate(2, 5),
    eligibilityCriteria: {
      minCgpa: 3.7,
      maxAge: 26,
      educationLevel: 'undergraduate'
    },
    status: 'active',
    createdAt: '2026-01-30T00:00:00Z',
    updatedAt: '2026-01-30T00:00:00Z'
  }
];

// Generate additional random scholarships to reach 100
const generateRandomScholarship = (index: number): Scholarship => {
  const providerType = providerTypes[Math.floor(Math.random() * providerTypes.length)];
  const currency = currencies[Math.floor(Math.random() * currencies.length)];
  const selectedFields = getRandomItems(fields, Math.floor(Math.random() * 3) + 2);
  const selectedCountries = getRandomItems(countries, Math.floor(Math.random() * 4) + 2);

  const providers = {
    government: ['Ministry of Education', 'Government Scholarship Board', 'National Scholarship Program'],
    university: ['State University', 'National University', 'Technology Institute', 'Business School'],
    corporate: ['Tech Corp', 'Finance Group', 'Innovation Labs', 'Global Industries'],
    ngo: ['Education Foundation', 'Youth Development Organization', 'Skills Development Fund'],
    foundation: ['Education Trust', 'Academic Excellence Foundation', 'Future Leaders Foundation'],
    individual: ['Smith Family Trust', 'Academic Excellence Fund', 'Community Education Fund']
  };

  const providerNames = providers[providerType];
  const provider = providerNames[Math.floor(Math.random() * providerNames.length)];

  const scholarshipTypes = [
    'Merit Scholarship', 'Excellence Award', 'Leadership Scholarship', 'Academic Grant',
    'Innovation Scholarship', 'Research Fellowship', 'Study Grant', 'Achievement Award'
  ];

  const scholarshipType = scholarshipTypes[Math.floor(Math.random() * scholarshipTypes.length)];
  const name = `${selectedCountries[0]} ${scholarshipType}`;

  return {
    id: `sch-${String(index + 11).padStart(3, '0')}`,
    name,
    provider,
    providerType,
    value: Math.floor(Math.random() * (100000 - 5000) + 5000),
    currency,
    eligibleFields: selectedFields,
    eligibleCountries: selectedCountries,
    deadline: getRandomFutureDate(1, 12),
    eligibilityCriteria: {
      minCgpa: (Math.floor(Math.random() * 15) + 25) / 10, // 2.5 - 4.0
      maxAge: Math.floor(Math.random() * 15) + 20, // 20-35
      educationLevel: Math.random() > 0.5 ? 'undergraduate' : 'postgraduate'
    },
    status: Math.random() > 0.9 ? 'pending' : 'active',
    createdAt: new Date(2026, 0, Math.floor(Math.random() * 28) + 1).toISOString(),
    updatedAt: new Date(2026, 0, Math.floor(Math.random() * 28) + 1).toISOString()
  };
};

// Add 90 more random scholarships
for (let i = 0; i < 90; i++) {
  mockScholarships.push(generateRandomScholarship(i));
}

/**
 * Simulates an API call with delay
 */
export const fetchMockScholarships = async (delay: number = 300): Promise<Scholarship[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockScholarships);
    }, delay);
  });
};

/**
 * Filter scholarships based on criteria
 */
export const filterScholarships = (
  scholarships: Scholarship[],
  filters: {
    query?: string;
    countries?: string[];
    fields?: string[];
    providerTypes?: string[];
    minValue?: number;
    maxValue?: number;
    deadlineMonths?: number;
  }
): Scholarship[] => {
  let filtered = [...scholarships];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(
      s =>
        s.name.toLowerCase().includes(query) ||
        s.provider.toLowerCase().includes(query) ||
        s.eligibleFields.some((f: string) => f.toLowerCase().includes(query))
    );
  }

  // Country filter
  if (filters.countries && filters.countries.length > 0) {
    filtered = filtered.filter(s =>
      s.eligibleCountries.some((c: string) => filters.countries!.includes(c))
    );
  }

  // Field filter
  if (filters.fields && filters.fields.length > 0) {
    filtered = filtered.filter(s =>
      s.eligibleFields.some((f: string) => filters.fields!.includes(f))
    );
  }

  // Provider type filter
  if (filters.providerTypes && filters.providerTypes.length > 0) {
    filtered = filtered.filter(s => filters.providerTypes!.includes(s.providerType));
  }

  // Value range filter
  if (filters.minValue !== undefined) {
    filtered = filtered.filter(s => {
      // Convert to USD for comparison (simplified)
      const valueInUSD = s.currency === 'USD' ? s.value : s.value * 0.75;
      return valueInUSD >= filters.minValue!;
    });
  }

  if (filters.maxValue !== undefined) {
    filtered = filtered.filter(s => {
      const valueInUSD = s.currency === 'USD' ? s.value : s.value * 0.75;
      return valueInUSD <= filters.maxValue!;
    });
  }

  // Deadline filter
  if (filters.deadlineMonths !== undefined) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(futureDate.getMonth() + filters.deadlineMonths);

    filtered = filtered.filter(s => new Date(s.deadline) <= futureDate);
  }

  return filtered;
};

// Export available filter options for UI
export const filterOptions = {
  countries: [...new Set(mockScholarships.flatMap(s => s.eligibleCountries))].sort(),
  fields: [...new Set(mockScholarships.flatMap(s => s.eligibleFields))].sort(),
  providerTypes: ['government', 'university', 'corporate', 'ngo', 'foundation', 'individual'],
  currencies: [...new Set(mockScholarships.map(s => s.currency))].sort()
};
