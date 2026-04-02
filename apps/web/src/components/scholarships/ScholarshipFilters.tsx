'use client';

import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { filterOptions } from '@/lib/mockData';
import type { ScholarshipFilters } from '@/types';

export interface ScholarshipFiltersProps {
  filters: ScholarshipFilters;
  onFiltersChange: (filters: ScholarshipFilters) => void;
  onClearFilters: () => void;
  availableValues?: {
    countries: string[];
    fields: string[];
    providerTypes: string[];
  };
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

export function ScholarshipFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  availableValues,
  className,
}: ScholarshipFiltersProps) {
  const { t } = useTranslation();

  const handleCountryToggle = (country: string) => {
    const currentCountries = filters.countries || [];
    const newCountries = currentCountries.includes(country)
      ? currentCountries.filter((c) => c !== country)
      : [...currentCountries, country];
    onFiltersChange({ ...filters, countries: newCountries });
  };

  const handleFieldToggle = (field: string) => {
    const currentFields = filters.fields || [];
    const newFields = currentFields.includes(field)
      ? currentFields.filter((f) => f !== field)
      : [...currentFields, field];
    onFiltersChange({ ...filters, fields: newFields });
  };

  const handleProviderTypeToggle = (type: string) => {
    const currentTypes = filters.providerTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    onFiltersChange({ ...filters, providerTypes: newTypes });
  };

  const handleDeadlineChange = (months: number | null) => {
    onFiltersChange({
      ...filters,
      deadlineWithinMonths: (months === null || months === filters.deadlineWithinMonths) ? undefined : months,
    });
  };

  const handleMinValueChange = (value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    onFiltersChange({ ...filters, minValue: numValue });
  };

  const handleMaxValueChange = (value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    onFiltersChange({ ...filters, maxValue: numValue });
  };

  // Count active filters
  const activeFilterCount =
    (filters.countries?.length || 0) +
    (filters.fields?.length || 0) +
    (filters.providerTypes?.length || 0) +
    (filters.deadlineWithinMonths ? 1 : 0) +
    (filters.minValue ? 1 : 0) +
    (filters.maxValue ? 1 : 0);

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
      {/* Header with Clear All button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">{t('scholarships.filtersList.title')}</h2>
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
            {t('scholarships.filtersList.clearAll')}
          </button>
        )}
      </div>

      {/* Countries Filter */}
      <FilterSection title={t('scholarships.filtersList.countries')}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.countries.map((country) => {
            const isAvailable = !availableValues || availableValues.countries.includes(country);
            return (
              <label
                key={country}
                className={cn(
                  "flex items-center p-1 rounded transition-colors",
                  isAvailable ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-50 bg-gray-100"
                )}
              >
                <input
                  type="checkbox"
                  checked={filters.countries?.includes(country) || false}
                  onChange={() => isAvailable && handleCountryToggle(country)}
                  disabled={!isAvailable}
                  className={cn(
                    "h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500",
                    !isAvailable && "opacity-50 pointer-events-none"
                  )}
                />
                <span className="ml-2 text-sm text-gray-700">{country}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Fields of Study Filter */}
      <FilterSection title={t('scholarships.filtersList.fieldsOfStudy')}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filterOptions.fields.map((field) => {
            const isAvailable = !availableValues || availableValues.fields.includes(field);
            return (
              <label
                key={field}
                className={cn(
                  "flex items-center p-1 rounded transition-colors",
                  isAvailable ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-50 bg-gray-100"
                )}
              >
                <input
                  type="checkbox"
                  checked={filters.fields?.includes(field) || false}
                  onChange={() => isAvailable && handleFieldToggle(field)}
                  disabled={!isAvailable}
                  className={cn(
                    "h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500",
                    !isAvailable && "opacity-50 pointer-events-none"
                  )}
                />
                <span className="ml-2 text-sm text-gray-700">{field}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Provider Type Filter */}
      <FilterSection title={t('scholarships.filtersList.providerType')}>
        <div className="space-y-2">
          {filterOptions.providerTypes.map((type) => {
            const isAvailable = !availableValues || availableValues.providerTypes.includes(type);
            return (
              <label
                key={type}
                className={cn(
                  "flex items-center p-1 rounded transition-colors",
                  isAvailable ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-50 bg-gray-100"
                )}
              >
                <input
                  type="checkbox"
                  checked={filters.providerTypes?.includes(type) || false}
                  onChange={() => isAvailable && handleProviderTypeToggle(type)}
                  disabled={!isAvailable}
                  className={cn(
                    "h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500",
                    !isAvailable && "opacity-50 pointer-events-none"
                  )}
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Value Range Filter */}
      <FilterSection title={t('scholarships.filtersList.scholarshipValue')}>
        <div className="space-y-3">
          <div>
            <label htmlFor="min-value" className="block text-xs text-gray-600 mb-1">
              {t('scholarships.filtersList.minValue')}
            </label>
            <input
              id="min-value"
              type="number"
              value={filters.minValue || ''}
              onChange={(e) => handleMinValueChange(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="max-value" className="block text-xs text-gray-600 mb-1">
              {t('scholarships.filtersList.maxValue')}
            </label>
            <input
              id="max-value"
              type="number"
              value={filters.maxValue || ''}
              onChange={(e) => handleMaxValueChange(e.target.value)}
              placeholder="100000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </FilterSection>

      {/* Deadline Filter */}
      <FilterSection title={t('scholarships.filtersList.deadline')}>
        <div className="space-y-2">
          {[1, 3, 6, 12].map((months) => (
            <label key={months} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="deadline"
                checked={filters.deadlineWithinMonths === months}
                onChange={() => handleDeadlineChange(months)}
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {t('scholarships.filtersList.within')} {months} {months === 1 ? t('scholarships.filtersList.month') : t('scholarships.filtersList.months')}
              </span>
            </label>
          ))}
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="radio"
              name="deadline"
              checked={!filters.deadlineWithinMonths}
              onChange={() => handleDeadlineChange(null)}
              className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">{t('scholarships.filtersList.anyTime')}</span>
          </label>
        </div>
      </FilterSection>
    </div>
  );
}
