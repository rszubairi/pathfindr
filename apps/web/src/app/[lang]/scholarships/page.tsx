'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Filter, X } from 'lucide-react';
import { useQuery as useConvexQuery } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ScholarshipList } from '@/components/scholarships/ScholarshipList';
import { ScholarshipFilters } from '@/components/scholarships/ScholarshipFilters';
import { ScholarshipSearch } from '@/components/scholarships/ScholarshipSearch';
import { useScholarshipSearch } from '@/lib/convexQueries';
import type { ScholarshipFilters as Filters } from '@/types';

const ITEMS_PER_PAGE = 20;

export default function ScholarshipsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState<'relevant' | 'deadline' | 'value' | 'recent'>('relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get user's country from profile for "Local" tags
  const [storedUserId, setStoredUserId] = useState<string | null>(null);
  useEffect(() => {
    setStoredUserId(localStorage.getItem('userId'));
  }, []);
  const userProfile = useConvexQuery(
    api.profiles.getByUserId,
    storedUserId ? { userId: storedUserId as Id<'users'> } : 'skip'
  );
  const userCountry = userProfile?.country;

  // Fetch scholarships with search and filters
  const { data: scholarshipsData = [], isLoading } = useScholarshipSearch(searchQuery, filters);

  // Convert Convex _id to id for compatibility
  const scholarships = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scholarshipsData.map((s: any) => ({
        ...s,
        id: s._id,
      })),
    [scholarshipsData]
  );

  // Sort scholarships
  const sortedScholarships = useMemo(() => {
    const now = new Date().toISOString();
    
    // First, divide into featured and regular
    const featured = scholarships.filter(s => s.isFeatured && s.featuredUntil && s.featuredUntil > now);
    const regular = scholarships.filter(s => !(s.isFeatured && s.featuredUntil && s.featuredUntil > now));

    // Sort regular results
    const sortFunction = (a: any, b: any) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'value':
          return b.value - a.value;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'relevant':
        default:
          return searchQuery
            ? 0 // Search already sorts by relevance
            : new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
    };

    featured.sort(sortFunction);
    regular.sort(sortFunction);

    return [...featured, ...regular];
  }, [scholarships, sortBy, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(sortedScholarships.length / ITEMS_PER_PAGE);
  const paginatedScholarships = sortedScholarships.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  // Handle filter removal
  const handleRemoveFilter = useCallback(
    (filterType: keyof Filters, value?: string) => {
      const newFilters = { ...filters };

      if (filterType === 'countries' && value) {
        newFilters.countries = newFilters.countries?.filter((c) => c !== value);
      } else if (filterType === 'fields' && value) {
        newFilters.fields = newFilters.fields?.filter((f) => f !== value);
      } else if (filterType === 'providerTypes' && value) {
        newFilters.providerTypes = newFilters.providerTypes?.filter((t) => t !== value);
      } else if (filterType === 'minValue') {
        delete newFilters.minValue;
      } else if (filterType === 'maxValue') {
        delete newFilters.maxValue;
      } else if (filterType === 'deadlineWithinMonths') {
        delete newFilters.deadlineWithinMonths;
      }

      setFilters(newFilters);
    },
    [filters]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  // Toggle mobile filter drawer
  const toggleMobileFilter = useCallback(() => {
    setIsMobileFilterOpen((prev) => !prev);
  }, []);

  // Prevent body scroll when mobile filter is open
  React.useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  return (
    <MainLayout>
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-12 overflow-hidden">
        <Container size="xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl relative z-10">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                {t('scholarships.title')}
              </h1>
              <p className="text-lg text-gray-600">
                {t('scholarships.subtitle')}
              </p>
            </div>
            <div className="hidden md:block relative">
              <div className="relative h-[280px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/female-student-studying-at-college-library-2023-11-27-04-50-27-utc.webp"
                  alt="Student studying for scholarship opportunities"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <Container size="xl">
          {/* Search and Sort */}
          <div className="mb-6">
            <ScholarshipSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              resultCount={sortedScholarships.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button
              variant="secondary"
              size="md"
              onClick={toggleMobileFilter}
              className="w-full flex items-center justify-center gap-2"
            >
              <Filter className="h-5 w-5" />
              {t('scholarships.filters')}
              {Object.keys(filters).length > 0 && (
                <span className="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.keys(filters).length}
                </span>
              )}
            </Button>
          </div>

          {/* Desktop Layout: Sidebar + List */}
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-4">
                <ScholarshipFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </aside>

            {/* Scholarship List */}
            <main className="lg:col-span-3">
              <ScholarshipList
                scholarships={paginatedScholarships}
                isLoading={isLoading}
                onClearFilters={handleClearFilters}
                userCountry={userCountry}
              />

              {/* Pagination */}
              {!isLoading && sortedScholarships.length > ITEMS_PER_PAGE && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    {t('scholarships.previous')}
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === pageNumber
                              ? 'bg-primary-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {t('scholarships.next')}
                  </Button>
                </div>
              )}
            </main>
          </div>
        </Container>
      </section>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={toggleMobileFilter}
          ></div>

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">{t('scholarships.filters')}</h2>
              <button
                onClick={toggleMobileFilter}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-4">
              <ScholarshipFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Apply Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
              <Button
                variant="primary"
                size="lg"
                onClick={toggleMobileFilter}
                className="w-full"
              >
                {t('scholarships.showResults', { count: sortedScholarships.length })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
