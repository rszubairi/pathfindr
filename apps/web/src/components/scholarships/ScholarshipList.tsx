import React from 'react';
import { SearchX } from 'lucide-react';
import { ScholarshipCard } from './ScholarshipCard';
import { ScholarshipSkeleton } from './ScholarshipSkeleton';
import { Button } from '@/components/ui/Button';
import type { Scholarship } from '@/types';

export interface ScholarshipListProps {
  scholarships: Scholarship[];
  isLoading?: boolean;
  showMatchScore?: boolean;
  onClearFilters?: () => void;
}

export function ScholarshipList({
  scholarships,
  isLoading = false,
  showMatchScore = false,
  onClearFilters,
}: ScholarshipListProps) {
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
        <h3 className="text-xl font-bold text-gray-900 mb-2">No scholarships found</h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          We couldn&apos;t find any scholarships matching your criteria. Try adjusting your filters or
          search query.
        </p>
        {onClearFilters && (
          <Button variant="primary" size="md" onClick={onClearFilters}>
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  // Display scholarships in a responsive grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scholarships.map((scholarship) => (
        <ScholarshipCard
          key={scholarship.id}
          scholarship={scholarship}
          showMatchScore={showMatchScore}
        />
      ))}
    </div>
  );
}
