'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Filter, X, SearchX, Building2, Bell, BellRing, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { BoardingSchoolCard } from '@/components/boardingSchools/BoardingSchoolCard';
import { BoardingSchoolFilters } from '@/components/boardingSchools/BoardingSchoolFilters';
import { ScholarshipSkeleton } from '@/components/scholarships/ScholarshipSkeleton';
import { useBoardingSchoolSearch, useBoardingSchoolStats } from '@/lib/convexQueries';
import { useAuth } from '@/hooks/useAuth';
import type { BoardingSchoolFilters as Filters } from '@/types';
import type { Id } from '../../../../../convex/_generated/dataModel';

const ITEMS_PER_PAGE = 20;

export default function BoardingSchoolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState<'name' | 'state' | 'category'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const { data: schoolsData = [], isLoading } = useBoardingSchoolSearch(searchQuery, filters);
  const { data: stats } = useBoardingSchoolStats();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schools = useMemo(() => schoolsData.map((s: any) => ({ ...s, id: s._id })), [schoolsData]);

  // Sort
  const sortedSchools = useMemo(() => {
    const sorted = [...schools];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'state':
        return sorted.sort((a, b) => a.state.localeCompare(b.state));
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
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
  filters.categories?.forEach((c) => activeFilters.push({ type: 'categories', label: c }));
  filters.states?.forEach((s) => activeFilters.push({ type: 'states', label: s }));
  if (filters.gender) activeFilters.push({ type: 'gender', label: filters.gender === 'male' ? 'Boys' : filters.gender === 'female' ? 'Girls' : 'Co-ed' });
  if (filters.entryLevel) activeFilters.push({ type: 'entryLevel', label: filters.entryLevel });
  if (filters.managedBy) activeFilters.push({ type: 'managedBy', label: filters.managedBy });

  const handleRemoveFilter = useCallback((filterType: string, value?: string) => {
    const newFilters = { ...filters };
    if (filterType === 'categories' && value) {
      newFilters.categories = newFilters.categories?.filter((c) => c !== value);
    } else if (filterType === 'states' && value) {
      newFilters.states = newFilters.states?.filter((s) => s !== value);
    } else if (filterType === 'gender') {
      delete newFilters.gender;
    } else if (filterType === 'entryLevel') {
      delete newFilters.entryLevel;
    } else if (filterType === 'managedBy') {
      delete newFilters.managedBy;
    }
    setFilters(newFilters);
  }, [filters]);

  const availableStates = stats?.states || [];

  return (
    <MainLayout>
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-indigo-50 to-purple-50 py-12 overflow-hidden">
        <Container size="xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                    Boarding Schools
                  </h1>
                </div>
              </div>
              <p className="text-lg text-gray-600">
                Discover {stats?.total || '95+'} government boarding schools across Malaysia.
                Browse SBP, MRSM, SMS, and more. Never miss an application deadline again.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                  <span className="font-semibold text-indigo-600">SBP</span>
                  <span className="text-gray-500">Apply: Aug - Sep</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                  <span className="font-semibold text-purple-600">MRSM</span>
                  <span className="text-gray-500">Apply: Mar - May</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="relative h-[280px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/pretty-girl-using-laptop-on-background-of-her-clas-2023-11-27-05-22-09-utc.webp"
                  alt="Students in a boarding school classroom"
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
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Search schools by name, e.g. MCKK, MRSM Langkawi..."
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
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'state' | 'category')}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="name">Name</option>
                    <option value="state">State</option>
                    <option value="category">Category</option>
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
                <BoardingSchoolFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={handleClearFilters}
                  availableStates={availableStates}
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
                    We couldn&apos;t find any boarding schools matching your criteria. Try adjusting your filters or search query.
                  </p>
                  <Button variant="primary" size="md" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSchools.map((school) => (
                    <BoardingSchoolCard key={school.id} school={school} />
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
              <BoardingSchoolFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
                availableStates={availableStates}
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
