'use client';

import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { BoardingSchoolFilters as Filters } from '@/types';

export interface BoardingSchoolFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
  availableStates: string[];
  className?: string;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
}

const categories = [
  'SBP Premier',
  'SMS',
  'SBPI',
  'SMAP',
  'TMUA',
  'MRSM Premier',
  'MRSM',
];

const managedByOptions = [
  { value: 'KPM', label: 'KPM (Ministry of Education)' },
  { value: 'MARA', label: 'MARA' },
];

const genderOptions = [
  { value: 'male', label: 'Boys Only' },
  { value: 'female', label: 'Girls Only' },
  { value: 'mixed', label: 'Co-ed (Mixed)' },
];

const entryLevelOptions = [
  { value: 'Tingkatan 1', label: 'Tingkatan 1 (Form 1)' },
  { value: 'Tingkatan 4', label: 'Tingkatan 4 (Form 4)' },
];

export function BoardingSchoolFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  availableStates,
  className,
}: BoardingSchoolFiltersProps) {
  const handleStateToggle = (state: string) => {
    const current = filters.states || [];
    const newStates = current.includes(state)
      ? current.filter((s) => s !== state)
      : [...current, state];
    onFiltersChange({ ...filters, states: newStates });
  };

  const handleCategoryToggle = (category: string) => {
    const current = filters.categories || [];
    const newCategories = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleGenderChange = (gender: string | undefined) => {
    onFiltersChange({ ...filters, gender: gender === filters.gender ? undefined : gender });
  };

  const handleEntryLevelChange = (level: string | undefined) => {
    onFiltersChange({ ...filters, entryLevel: level === filters.entryLevel ? undefined : level });
  };

  const handleManagedByChange = (managedBy: string | undefined) => {
    onFiltersChange({ ...filters, managedBy: managedBy === filters.managedBy ? undefined : managedBy });
  };

  const activeFilterCount =
    (filters.states?.length || 0) +
    (filters.categories?.length || 0) +
    (filters.gender ? 1 : 0) +
    (filters.entryLevel ? 1 : 0) +
    (filters.managedBy ? 1 : 0);

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="sm">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <FilterSection title="School Type">
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category) || false}
                onChange={() => handleCategoryToggle(category)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* State Filter */}
      <FilterSection title="State">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableStates.map((state) => (
            <label key={state} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={filters.states?.includes(state) || false}
                onChange={() => handleStateToggle(state)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{state}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Managed By Filter */}
      <FilterSection title="Managed By">
        <div className="space-y-2">
          {managedByOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="managedBy"
                checked={filters.managedBy === option.value}
                onChange={() => handleManagedByChange(option.value)}
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="radio"
              name="managedBy"
              checked={!filters.managedBy}
              onChange={() => handleManagedByChange(undefined)}
              className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">All</span>
          </label>
        </div>
      </FilterSection>

      {/* Gender Filter */}
      <FilterSection title="Gender" defaultOpen={false}>
        <div className="space-y-2">
          {genderOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === option.value}
                onChange={() => handleGenderChange(option.value)}
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="radio"
              name="gender"
              checked={!filters.gender}
              onChange={() => handleGenderChange(undefined)}
              className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">All</span>
          </label>
        </div>
      </FilterSection>

      {/* Entry Level Filter */}
      <FilterSection title="Entry Level" defaultOpen={false}>
        <div className="space-y-2">
          {entryLevelOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="entryLevel"
                checked={filters.entryLevel === option.value}
                onChange={() => handleEntryLevelChange(option.value)}
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="radio"
              name="entryLevel"
              checked={!filters.entryLevel}
              onChange={() => handleEntryLevelChange(undefined)}
              className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">All</span>
          </label>
        </div>
      </FilterSection>
    </div>
  );
}
