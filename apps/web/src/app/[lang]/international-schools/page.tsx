'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Filter, X, SearchX, Globe2, MapPin, Navigation, XCircle } from 'lucide-react';
import { calculateDistance, MAJOR_CITIES } from '@/lib/distance';
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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState<'name' | 'country' | 'city' | 'distance'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const { data: schoolsData = [], isLoading } = useInternationalSchoolSearch(searchQuery, filters);
  const { data: stats } = useInternationalSchoolStats();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schools = useMemo(() => schoolsData.map((s: any) => ({ ...s, id: s._id })), [schoolsData]);

  // Distance map
  const distanceMap = useMemo(() => {
    if (!userLocation) return new Map<string, number>();
    const map = new Map<string, number>();
    for (const school of schools) {
      if (school.latitude != null && school.longitude != null) {
        map.set(school.id, calculateDistance(userLocation.lat, userLocation.lng, school.latitude, school.longitude));
      }
    }
    return map;
  }, [schools, userLocation]);

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
      case 'distance':
        return sorted.sort((a, b) => (distanceMap.get(a.id) ?? Infinity) - (distanceMap.get(b.id) ?? Infinity));
      default:
        return sorted;
    }
  }, [schools, sortBy, distanceMap]);

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

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'My Location' });
        setSortBy('distance');
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleSelectCity = useCallback((cityName: string) => {
    const city = MAJOR_CITIES.find((c) => c.name === cityName);
    if (city) {
      setUserLocation({ lat: city.lat, lng: city.lng, label: city.name });
      setSortBy('distance');
    }
  }, []);

  const handleClearLocation = useCallback(() => {
    setUserLocation(null);
    if (sortBy === 'distance') setSortBy('name');
  }, [sortBy]);

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
      <section className="relative bg-gradient-to-br from-blue-50 to-cyan-50 py-12 overflow-hidden">
        <Container size="xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Globe2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                    {t('internationalSchools.title')}
                  </h1>
                </div>
              </div>
              <p className="text-lg text-gray-600">
                {t('internationalSchools.subtitle', { total: stats?.total || '60+' })}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {stats?.byCountry && Object.entries(stats.byCountry).map(([country, count]) => (
                  <div key={country} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                    <span className="font-semibold text-blue-600">{country}</span>
                    <span className="text-gray-500">{t('internationalSchools.schoolsCount', { count: count as number })}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="relative h-[280px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/pretty-girl-using-laptop-on-background-of-her-clas-2023-11-27-05-22-09-utc.webp"
                  alt="Students learning in an international school environment"
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

      {/* Location Bar */}
      <section className="bg-white border-b border-gray-200 py-4">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{t('internationalSchools.location.title')}</span>
            </div>

            {userLocation ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                  <Navigation className="w-3.5 h-3.5" />
                  {userLocation.label}
                </span>
                <button
                  onClick={handleClearLocation}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                  title="Clear location"
                >
                  <XCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <button
                  onClick={handleUseMyLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium border border-primary-200 hover:bg-primary-100 transition disabled:opacity-50"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {isLocating ? t('internationalSchools.location.locating') : t('internationalSchools.location.useCurrent')}
                </button>
                <span className="text-xs text-gray-400">{t('internationalSchools.location.or')}</span>
                <select
                  onChange={(e) => { if (e.target.value) handleSelectCity(e.target.value); }}
                  defaultValue=""
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="" disabled>{t('internationalSchools.location.selectCity')}</option>
                  {MAJOR_CITIES.map((city) => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            )}
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
                    placeholder={t('internationalSchools.search.placeholder')}
                    onSearch={setSearchQuery}
                    debounceMs={400}
                    showClearButton
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {t('internationalSchools.sort.label')}
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'country' | 'city' | 'distance')}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  >
                    <option value="name">{t('internationalSchools.sort.name')}</option>
                    <option value="country">{t('internationalSchools.sort.country')}</option>
                    <option value="city">{t('internationalSchools.sort.city')}</option>
                    {userLocation && <option value="distance">{t('internationalSchools.location.distance')}</option>}
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(activeFilters.length > 0 || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    {t(sortedSchools.length === 1 ? 'internationalSchools.results.school' : 'internationalSchools.results.schools', { count: sortedSchools.length })}
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
              {t('internationalSchools.mobile.filters')}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('internationalSchools.empty.title')}</h3>
                  <p className="text-gray-600 text-center mb-6 max-w-md">
                    {t('internationalSchools.empty.description')}
                  </p>
                  <Button variant="primary" size="md" onClick={handleClearFilters}>
                    {t('internationalSchools.empty.clearAll')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSchools.map((school) => (
                    <InternationalSchoolCard key={school.id} school={school} distance={distanceMap.get(school.id)} />
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
                    {t('internationalSchools.pagination.previous')}
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
                    {t('internationalSchools.pagination.next')}
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
              <h2 className="text-lg font-bold text-gray-900">{t('internationalSchools.filters.title')}</h2>
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
                {t('internationalSchools.mobile.showResults', { count: sortedSchools.length })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
