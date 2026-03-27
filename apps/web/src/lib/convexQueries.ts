import { useQuery as useConvexQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { ScholarshipFilters } from '@/types';
import { useMemo } from 'react';

/**
 * Hook to get all scholarships with optional filters
 */
export function useScholarships(filters?: ScholarshipFilters) {
  // Get all scholarships from Convex (active + pending, excluding closed)
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
      }
      : {}
  );

  // Filter out closed scholarships
  const filtered = useMemo(() => {
    if (!scholarships) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return scholarships.filter((s: any) => s.status !== 'closed');
  }, [scholarships]);

  return {
    data: filtered,
    isLoading: scholarships === undefined,
    error: null,
  };
}

/**
 * Hook to search scholarships by query and apply filters
 */
export function useScholarshipSearch(query: string, filters?: ScholarshipFilters) {
  // Get search results from Convex (no status filter — include active + pending)
  const searchResults = useConvexQuery(api.scholarships.search, {
    searchQuery: query,
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
      }
      : {}
  );

  // Combine search and filter results, excluding closed scholarships
  const data = useMemo(() => {
    if (!searchResults || !filteredResults) return [];

    // If there's a search query, filter the search results by the filter criteria
    if (query) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredIds = new Set(filteredResults.map((s: any) => s._id));
      return searchResults
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((s: any) => filteredIds.has(s._id) && s.status !== 'closed');
    }

    // If no search query, just return filtered results excluding closed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return filteredResults.filter((s: any) => s.status !== 'closed');
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

// ============================================================
// International School Hooks
// ============================================================

/**
 * Hook to get international schools with filters, combined with optional search
 */
export function useInternationalSchoolSearch(query: string, filters?: {
  countries?: string[];
  curriculums?: string[];
}) {
  const searchResults = useConvexQuery(api.internationalSchools.search, {
    searchQuery: query || 'International',
  });

  const filteredResults = useConvexQuery(
    api.internationalSchools.filter,
    filters
      ? {
          countries: filters.countries,
          curriculums: filters.curriculums,
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
 * Hook to get international school statistics
 */
export function useInternationalSchoolStats() {
  const stats = useConvexQuery(api.internationalSchools.stats);

  return {
    data: stats,
    isLoading: stats === undefined,
    error: null,
  };
}
