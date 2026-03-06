import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';

export function ScholarshipSkeleton() {
  return (
    <Card variant="default" className="h-full flex flex-col animate-pulse">
      <CardContent className="flex-1 pt-6">
        {/* Header with provider type and match score */}
        <div className="flex items-start justify-between mb-3">
          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
        </div>

        {/* Title */}
        <div className="mb-2 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Provider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Value */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded w-28"></div>
        </div>

        {/* Countries */}
        <div className="mb-3">
          <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="flex flex-wrap gap-1">
            <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Fields of Study */}
        <div className="mb-4">
          <div className="h-3 bg-gray-200 rounded w-28 mb-1"></div>
          <div className="flex flex-wrap gap-1">
            <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-28 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="h-11 bg-gray-200 rounded-lg w-full"></div>
      </CardFooter>
    </Card>
  );
}
