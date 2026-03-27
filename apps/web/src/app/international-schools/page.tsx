'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Filter, X, SearchX, Globe2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { InternationalSchoolCard } from '@/components/internationalSchools/InternationalSchoolCard';
import { InternationalSchoolFilters } from '@/components/internationalSchools/InternationalSchoolFilters';
import { ScholarshipSkeleton } from '@/components/scholarships/ScholarshipSkeleton';
import { useInternationalSchoolSearch, useInternationalSchoolStats } from '@/lib/convexQueries';
import type { InternationalSchoolFilters as Filters } from '@/types';

const ITEMS_PER_PAGE = 21;

export default function InternationalSchoolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState<'name' | 'country' | 'city'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data: schoolsData = [], isLoading } = useInternationalSchoolSearch(searchQuery, filters);
  const { data: stats } = useInternationalSchoolStats();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schools = useMemo(() => schoolsData.map((s: any) => ({ ...s, id: s._id })), [schoolsData]);

  // Sort
  const sortedSchools = useMemo(() => {
    const sorted = [...schools];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'country':
        return sorted.sort((a, b) => a.country.localeCompare(b.country));
      case 'city':
        return sorted.sort((a, b) => a.city.localeCompare(b.city));
      default:
        return sorted;
    }
  }, [schools, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedSchools.length / ITEMS_PER_PAGE);
  const paginatedSchools = sortedSchools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  const toggleMobileFilter = useCallback(() => {
    setIsMobileFilterOpen((prev) => !prev);
  }, []);

  React.useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileFilterOpen]);

  // Build active filter chips
  const activeFilters: Array<{ type: string; label: string }> = [];
  filters.countries?.forEach((c) => activeFilters.push({ type: 'countries', label: c }));
  filters.curriculums?.forEach((c) => activeFilters.push({ type: 'curriculums', label: c }));

  const handleRemoveFilter = useCallback((filterType: string, value?: string) => {
    const newFilters = { ...filters };
    if (filterType === 'countries' && value) {
      newFilters.countries = newFilters.countries?.filter((c) => c !== value);
      if (newFilters.countries?.length === 0) newFilters.countries = undefined;
    } else if (filterType === 'curriculums' && value) {
      newFilters.curriculums = newFilters.curriculums?.filter((c) => c !== value);
      if (newFilters.curriculums?.length === 0) newFilters.curriculums = undefined;
    }
    setFilters(newFilters);
  }, [filters]);

  const availableCountries = stats?.countries || [];
  const availableCurriculums = stats?.curriculums || [];

  return (
    <MainLayout>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
        <Container size="xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                  International Schools
                </h1>
              </div>
            </div>
            <p className="text-lg text-gray-600">
              Explore {stats?.total || '60+'} top international schools across Malaysia, Indonesia, and China.
              Compare curricula, fees, and find the perfect school for your education journey.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {stats?.byCountry && Object.entries(stats.byCountry).map(([country, count]) => (
                <div key={country} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                  <span className="font-semibold text-blue-600">{country}</span>
                  <span className="text-gray-500">{count as number} schools</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <Container size="xl">
          {/* Search and Sort */}
          <div className="mb-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Search schools by name, e.g. ISKL, Dulwich, JIS..."
                    onSearch={setSearchQuery}
                    debounceMs={400}
                    showClearButton
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'country' | 'city')}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="name">Name</option>
                    <option value="country">Country</option>
                    <option value="city">City</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(activeFilters.length > 0 || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    {sortedSchools.length} {sortedSchools.length === 1 ? 'school' : 'schools'} found
                  </span>
                  {activeFilters.length > 0 && <span className="text-gray-300">|</span>}
                  {activeFilters.map((filter, index) => (
                    <Badge
                      key={`${filter.type}-${filter.label}-${index}`}
                      variant="primary"
                      size="sm"
                      className="cursor-pointer hover:bg-primary-200 transition flex items-center gap-1"
                      onClick={() => handleRemoveFilter(filter.type, filter.label)}
                    >
                      {filter.label}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
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
              Filters
              {activeFilters.length > 0 && (
                <span className="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </div>

          {/* Desktop Layout */}
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-4">
                <InternationalSchoolFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={handleClearFilters}
                  availableCountries={availableCountries}
                  availableCurriculums={availableCurriculums}
                />
              </div>
            </aside>

            {/* School List */}
            <main className="lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ScholarshipSkeleton key={index} />
                  ))}
                </div>
              ) : paginatedSchools.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <SearchX className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No schools found</h3>
                  <p className="text-gray-600 text-center mb-6 max-w-md">
                    We couldn&apos;t find any international schools matching your criteria. Try adjusting your filters or search query.
                  </p>
                  <Button variant="primary" size="md" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSchools.map((school) => (
                    <InternationalSchoolCard key={school.id} school={school} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && sortedSchools.length > ITEMS_PER_PAGE && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
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
                          className={`w-10 h-10 rounded-lg font-medium transition ${
                            currentPage === pageNumber
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
                    Next
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
          <div className="absolute inset-0 bg-black/50" onClick={toggleMobileFilter}></div>
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={toggleMobileFilter} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <InternationalSchoolFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
                availableCountries={availableCountries}
                availableCurriculums={availableCurriculums}
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
              <Button variant="primary" size="lg" onClick={toggleMobileFilter} className="w-full">
                Show {sortedSchools.length} Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
