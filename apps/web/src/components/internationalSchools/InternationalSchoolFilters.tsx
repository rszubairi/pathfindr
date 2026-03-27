'use client';

import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { InternationalSchoolFilters as Filters } from '@/types';

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
  availableCountries: string[];
  availableCurriculums: string[];
}

const COUNTRIES = ['Malaysia', 'Indonesia', 'China'];

export function InternationalSchoolFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  availableCurriculums,
}: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    countries: true,
    curriculums: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeCount =
    (filters.countries?.length || 0) + (filters.curriculums?.length || 0);

  const toggleCountry = (country: string) => {
    const current = filters.countries || [];
    const updated = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    onFiltersChange({ ...filters, countries: updated.length > 0 ? updated : undefined });
  };

  const toggleCurriculum = (curriculum: string) => {
    const current = filters.curriculums || [];
    const updated = current.includes(curriculum)
      ? current.filter((c) => c !== curriculum)
      : [...current, curriculum];
    onFiltersChange({ ...filters, curriculums: updated.length > 0 ? updated : undefined });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-bold">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Country Filter */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('countries')}
          className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Country
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.countries ? 'rotate-180' : ''}`} />
        </button>
        {openSections.countries && (
          <div className="px-4 pb-3 space-y-2">
            {COUNTRIES.map((country) => (
              <label key={country} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.countries?.includes(country) || false}
                  onChange={() => toggleCountry(country)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{country}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Curriculum Filter */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('curriculums')}
          className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Curriculum
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.curriculums ? 'rotate-180' : ''}`} />
        </button>
        {openSections.curriculums && (
          <div className="px-4 pb-3 space-y-2">
            {availableCurriculums.map((curriculum) => (
              <label key={curriculum} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.curriculums?.includes(curriculum) || false}
                  onChange={() => toggleCurriculum(curriculum)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{curriculum}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear button */}
      {activeCount > 0 && (
        <div className="px-4 py-3">
          <Button variant="secondary" size="sm" onClick={onClearFilters} className="w-full">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
