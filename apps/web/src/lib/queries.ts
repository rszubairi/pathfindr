import { useQuery } from '@tanstack/react-query';
import type { Scholarship } from '@/types';
import { fetchMockScholarships, filterScholarships } from './mockData';

/**
 * React Query hooks for data fetching
 * Currently uses mock data - will be replaced with real API calls when backend is ready
 */

// Toggle between mock and real API
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

interface ScholarshipFilters {
  query?: string;
  countries?: string[];
  fields?: string[];
  providerTypes?: string[];
  minValue?: number;
  maxValue?: number;
  deadlineMonths?: number;
  limit?: number;
  offset?: number;
}

/**
 * Fetch all scholarships with optional filters
 */
export function useScholarships(filters?: ScholarshipFilters) {
  return useQuery({
    queryKey: ['scholarships', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Use mock data
        const allScholarships = await fetchMockScholarships();
        let filtered = filterScholarships(allScholarships, filters || {});

        // Apply status filter (only active scholarships by default)
        filtered = filtered.filter(s => s.status === 'active');

        // Apply pagination
        if (filters?.limit) {
          const offset = filters.offset || 0;
          filtered = filtered.slice(offset, offset + filters.limit);
        }

        return {
          scholarships: filtered,
          total: filtered.length,
        };
      } else {
        // TODO: Replace with real API call when backend is ready
        // const { scholarshipApi } = await import('./api');
        // const response = await scholarshipApi.getAll(filters);
        // return response.data;
        throw new Error('Real API not yet implemented');
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Search scholarships with query and filters
 */
export function useScholarshipSearch(query: string, filters?: Omit<ScholarshipFilters, 'query'>) {
  return useScholarships({
    ...filters,
    query,
  });
}

/**
 * Fetch single scholarship by ID
 */
export function useScholarship(id: string) {
  return useQuery({
    queryKey: ['scholarship', id],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        const allScholarships = await fetchMockScholarships();
        const scholarship = allScholarships.find(s => s.id === id);

        if (!scholarship) {
          throw new Error('Scholarship not found');
        }

        return scholarship;
      } else {
        // TODO: Replace with real API call
        // const { scholarshipApi } = await import('./api');
        // const response = await scholarshipApi.getById(id);
        // return response.data;
        throw new Error('Real API not yet implemented');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}

/**
 * Get featured scholarships for homepage
 */
export function useFeaturedScholarships(limit: number = 4) {
  return useQuery({
    queryKey: ['scholarships', 'featured', limit],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        const allScholarships = await fetchMockScholarships();

        // Filter for active and high-value scholarships
        const featured = allScholarships
          .filter(s => s.status === 'active' && s.value >= 20000)
          .sort((a, b) => b.value - a.value)
          .slice(0, limit);

        return featured;
      } else {
        // TODO: Replace with real API call
        throw new Error('Real API not yet implemented');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get scholarship statistics for homepage
 */
export function useScholarshipStats() {
  return useQuery({
    queryKey: ['scholarships', 'stats'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        const allScholarships = await fetchMockScholarships();

        // Calculate statistics
        const totalScholarships = allScholarships.filter(s => s.status === 'active').length;
        const uniqueCountries = new Set(allScholarships.flatMap(s => s.eligibleCountries)).size;
        const totalValue = allScholarships.reduce((sum, s) => {
          // Convert to USD for total (simplified)
          const valueInUSD = s.currency === 'USD' ? s.value : s.value * 0.75;
          return sum + valueInUSD;
        }, 0);

        return {
          totalScholarships,
          totalCountries: uniqueCountries,
          totalValue: Math.round(totalValue),
          totalStudents: 5000, // Mock value
        };
      } else {
        // TODO: Replace with real API call
        throw new Error('Real API not yet implemented');
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
