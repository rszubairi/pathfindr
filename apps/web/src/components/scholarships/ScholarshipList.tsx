import React from 'react';
import { SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ScholarshipCard } from './ScholarshipCard';
import { ScholarshipSkeleton } from './ScholarshipSkeleton';
import { Button } from '@/components/ui/Button';
import type { Scholarship } from '@/types';

export interface ScholarshipListProps {
  scholarships: Scholarship[];
  isLoading?: boolean;
  showMatchScore?: boolean;
  onClearFilters?: () => void;
  userCountry?: string;
}

export function ScholarshipList({
  scholarships,
  isLoading = false,
  showMatchScore = false,
  onClearFilters,
  userCountry,
}: ScholarshipListProps) {
  const { t } = useTranslation();

  // Loading state - show skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ScholarshipSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Empty state - no scholarships found
  if (scholarships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <SearchX className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('scholarships.noResults')}</h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {t('scholarships.noResultsDesc')}
        </p>
        {onClearFilters && (
          <Button variant="primary" size="md" onClick={onClearFilters}>
            {t('scholarships.clearFilters')}
          </Button>
        )}
      </div>
    );
  }

  const now = new Date().toISOString();
  const featuredScholarships = scholarships.filter(
    (s: any) => s.isFeatured && s.featuredUntil && s.featuredUntil > now
  );
  const regularScholarships = scholarships.filter(
    (s: any) => !(s.isFeatured && s.featuredUntil && s.featuredUntil > now)
  );

  // Display scholarships
  return (
    <div className="space-y-8">
      {/* Featured Scholarships Section */}
      {featuredScholarships.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-wider text-[11px]">
            <span className="h-1 w-12 bg-primary-600 rounded-full" />
            {t('scholarships.featuredResults')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                showMatchScore={showMatchScore}
                userCountry={userCountry}
                isPremium={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularScholarships.map((scholarship) => (
          <ScholarshipCard
            key={scholarship.id}
            scholarship={scholarship}
            showMatchScore={showMatchScore}
            userCountry={userCountry}
          />
        ))}
      </div>
    </div>
  );
}
