'use client';

import React from 'react';
import { X, ArrowUpDown } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import type { ScholarshipFilters } from '@/types';

export interface ScholarshipSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: ScholarshipFilters;
  onRemoveFilter: (filterType: keyof ScholarshipFilters, value?: string) => void;
  resultCount: number;
  sortBy: 'relevant' | 'deadline' | 'value' | 'recent';
  onSortChange: (sort: 'relevant' | 'deadline' | 'value' | 'recent') => void;
}

export function ScholarshipSearch({
  searchQuery,
  onSearchChange,
  filters,
  onRemoveFilter,
  resultCount,
  sortBy,
  onSortChange,
}: ScholarshipSearchProps) {
  // Build active filter chips
  const activeFilters: Array<{
    type: keyof ScholarshipFilters;
    label: string;
    value?: string;
  }> = [];

  // Add country filters
  filters.countries?.forEach((country) => {
    activeFilters.push({ type: 'countries', label: country, value: country });
  });

  // Add field filters
  filters.fields?.forEach((field) => {
    activeFilters.push({ type: 'fields', label: field, value: field });
  });

  // Add provider type filters
  filters.providerTypes?.forEach((type) => {
    activeFilters.push({
      type: 'providerTypes',
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: type,
    });
  });

  // Add value range filters
  if (filters.minValue) {
    activeFilters.push({
      type: 'minValue',
      label: `Min: $${filters.minValue.toLocaleString()}`,
    });
  }
  if (filters.maxValue) {
    activeFilters.push({
      type: 'maxValue',
      label: `Max: $${filters.maxValue.toLocaleString()}`,
    });
  }

  // Add deadline filter
  if (filters.deadlineWithinMonths) {
    const months = filters.deadlineWithinMonths;
    activeFilters.push({
      type: 'deadlineWithinMonths',
      label: `Within ${months} ${months === 1 ? 'month' : 'months'}`,
    });
  }

  return (
    <div className="space-y-4">
      {/* Search Bar and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            placeholder="Search scholarships by name, provider, or keyword..."
            onSearch={onSearchChange}
            debounceMs={400}
            showClearButton
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as 'relevant' | 'deadline' | 'value' | 'recent')
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="relevant">Relevant</option>
            <option value="deadline">Deadline</option>
            <option value="value">Value</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </div>

      {/* Active Filters and Result Count */}
      {(activeFilters.length > 0 || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Result Count */}
          <span className="text-sm text-gray-600 font-medium">
            {resultCount} {resultCount === 1 ? 'scholarship' : 'scholarships'} found
          </span>

          {/* Separator */}
          {activeFilters.length > 0 && <span className="text-gray-300">|</span>}

          {/* Active Filter Chips */}
          {activeFilters.map((filter, index) => (
            <Badge
              key={`${filter.type}-${filter.value || filter.label}-${index}`}
              variant="primary"
              size="sm"
              className="cursor-pointer hover:bg-primary-200 transition flex items-center gap-1"
              onClick={() => onRemoveFilter(filter.type, filter.value)}
            >
              {filter.label}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
