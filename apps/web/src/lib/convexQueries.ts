import { useQuery as useConvexQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { ScholarshipFilters } from '@/types';
import { useMemo } from 'react';

/**
 * Hook to get all scholarships with optional filters
 */
export function useScholarships(filters?: ScholarshipFilters) {
  // Get all scholarships from Convex
  const scholarships = useConvexQuery(
    api.scholarships.filter,
    filters
      ? {
        countries: filters.countries,
        fields: filters.fields,
        providerTypes: filters.providerTypes,
        minValue: filters.minValue,
        maxValue: filters.maxValue,
        deadlineWithinMonths: filters.deadlineWithinMonths,
        status: 'active',
      }
      : { status: 'active' }
  );

  return {
    data: scholarships || [],
    isLoading: scholarships === undefined,
    error: null,
  };
}

/**
 * Hook to search scholarships by query and apply filters
 */
export function useScholarshipSearch(query: string, filters?: ScholarshipFilters) {
  // Get search results from Convex
  const searchResults = useConvexQuery(api.scholarships.search, {
    searchQuery: query,
    status: 'active',
  });

  // Get filtered results if filters are provided
  const filteredResults = useConvexQuery(
    api.scholarships.filter,
    filters
      ? {
        countries: filters.countries,
        fields: filters.fields,
        providerTypes: filters.providerTypes,
        minValue: filters.minValue,
        maxValue: filters.maxValue,
        deadlineWithinMonths: filters.deadlineWithinMonths,
        status: 'active',
      }
      : { status: 'active' }
  );

  // Combine search and filter results
  const data = useMemo(() => {
    if (!searchResults || !filteredResults) return [];

    // If there's a search query, filter the search results by the filter criteria
    if (query) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredIds = new Set(filteredResults.map((s: any) => s._id));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return searchResults.filter((s: any) => filteredIds.has(s._id));
    }

    // If no search query, just return filtered results
    return filteredResults;
  }, [searchResults, filteredResults, query]);

  return {
    data,
    isLoading: searchResults === undefined || filteredResults === undefined,
    error: null,
  };
}

/**
 * Hook to get a single scholarship by ID
 */
export function useScholarship(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scholarship = useConvexQuery(api.scholarships.getById, { id: id as any });

  return {
    data: scholarship,
    isLoading: scholarship === undefined,
    error: null,
  };
}

/**
 * Hook to get featured scholarships (highest value, active)
 */
export function useFeaturedScholarships(limit: number = 4) {
  const scholarships = useConvexQuery(api.scholarships.list, {
    status: 'active',
    limit,
  });

  // Sort by value descending
  const sortedScholarships = useMemo(() => {
    if (!scholarships) return [];
    return [...scholarships].sort((a, b) => b.value - a.value);
  }, [scholarships]);

  return {
    data: sortedScholarships.slice(0, limit),
    isLoading: scholarships === undefined,
    error: null,
  };
}

/**
 * Hook to get scholarship statistics
 */
export function useScholarshipStats() {
  const stats = useConvexQuery(api.scholarships.stats);

  return {
    data: stats,
    isLoading: stats === undefined,
    error: null,
  };
}

/**
 * Hook to increment application count when user clicks "Apply Now"
 */
export function useIncrementApplicationCount() {
  return useMutation(api.scholarships.incrementApplicationCount);
}

// ============================================================
// Boarding School Hooks
// ============================================================

/**
 * Hook to get boarding schools with filters, combined with optional search
 */
export function useBoardingSchoolSearch(query: string, filters?: {
  states?: string[];
  categories?: string[];
  gender?: string;
  entryLevel?: string;
  managedBy?: string;
}) {
  const searchResults = useConvexQuery(api.boardingSchools.search, {
    searchQuery: query || 'MRSM',
  });

  const filteredResults = useConvexQuery(
    api.boardingSchools.filter,
    filters
      ? {
          states: filters.states,
          categories: filters.categories,
          gender: filters.gender,
          entryLevel: filters.entryLevel,
          managedBy: filters.managedBy,
        }
      : {}
  );

  const data = useMemo(() => {
    if (!searchResults || !filteredResults) return [];

    if (query) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredIds = new Set(filteredResults.map((s: any) => s._id));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return searchResults.filter((s: any) => filteredIds.has(s._id));
    }

    return filteredResults;
  }, [searchResults, filteredResults, query]);

  return {
    data,
    isLoading: searchResults === undefined || filteredResults === undefined,
    error: null,
  };
}

/**
 * Hook to get boarding school statistics
 */
export function useBoardingSchoolStats() {
  const stats = useConvexQuery(api.boardingSchools.stats);

  return {
    data: stats,
    isLoading: stats === undefined,
    error: null,
  };
}
