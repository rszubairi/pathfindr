'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, ExternalLink, MapPin, BookOpen, TrendingUp, Clock, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate, getDeadlineUrgency } from '@/lib/utils';
import { getProviderLogo, getProviderTypeColor, getProviderInitials } from '@/lib/providerLogos';
import type { Scholarship } from '@/types';

export interface ScholarshipCardProps {
  scholarship: Scholarship;
  showMatchScore?: boolean;
}

/**
 * Provider Logo component – tries an <img> with Clearbit/mapped URL,
 * falls back to a coloured initials avatar on error.
 */
function ProviderLogo({
  provider,
  providerType,
  size = 'md',
}: {
  provider: string;
  providerType: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = getProviderLogo(provider);
  const colors = getProviderTypeColor(providerType);
  const initials = getProviderInitials(provider);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  const imgSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  if (logoUrl && !imgError) {
    return (
      <div className={`${imgSizeClasses[size]} rounded-xl overflow-hidden border border-gray-100 bg-white flex items-center justify-center shadow-sm flex-shrink-0`}>
        <img
          src={logoUrl}
          alt={`${provider} logo`}
          className="w-full h-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback initilas avatar
  return (
    <div
      className={`${sizeClasses[size]} rounded-xl border ${colors.border} ${colors.bg} flex items-center justify-center font-bold ${colors.text} flex-shrink-0 shadow-sm`}
    >
      {initials}
    </div>
  );
}

export function ScholarshipCard({ scholarship, showMatchScore = false }: ScholarshipCardProps) {
  const deadlineUrgency = getDeadlineUrgency(scholarship.deadline);
  const colors = getProviderTypeColor(scholarship.providerType);

  const deadlineBadgeVariant =
    deadlineUrgency === 'urgent' ? 'danger' :
      deadlineUrgency === 'soon' ? 'warning' :
        'default';

  const providerTypeLabel =
    scholarship.providerType.charAt(0).toUpperCase() + scholarship.providerType.slice(1);

  const displayFields = scholarship.eligibleFields.slice(0, 2);
  const remainingFields = scholarship.eligibleFields.length - 2;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">

      {/* Top accent bar coloured by provider type */}
      <div
        className="h-1 w-full"
        style={{
          background:
            scholarship.providerType === 'government' ? 'linear-gradient(90deg,#3b82f6,#6366f1)' :
              scholarship.providerType === 'corporate' ? 'linear-gradient(90deg,#8b5cf6,#ec4899)' :
                scholarship.providerType === 'foundation' ? 'linear-gradient(90deg,#f59e0b,#ef4444)' :
                  scholarship.providerType === 'university' ? 'linear-gradient(90deg,#10b981,#3b82f6)' :
                    'linear-gradient(90deg,#6b7280,#374151)',
        }}
      />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header row: logo + provider type badge + match score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Logo */}
          <ProviderLogo
            provider={scholarship.provider}
            providerType={scholarship.providerType}
            size="md"
          />

          {/* Badges */}
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {providerTypeLabel}
            </span>

            {scholarship.status === 'pending' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="w-3 h-3" />
                Opening Soon
              </span>
            )}

            {showMatchScore && scholarship.matchScore && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3" />
                {scholarship.matchScore}% Match
              </span>
            )}
          </div>
        </div>

        {/* Provider name */}
        <p className="text-xs font-medium text-gray-500 mb-1 truncate">{scholarship.provider}</p>

        {/* Scholarship name */}
        <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors duration-200">
          {scholarship.name}
        </h3>

        {/* Value */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-extrabold text-primary-600">
            {formatCurrency(scholarship.value, scholarship.currency)}
          </span>
          <span className="text-xs text-gray-400 font-medium">/year (est.)</span>
        </div>

        {/* Meta row: fields */}
        {displayFields.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <BookOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            {displayFields.map((field) => (
              <span
                key={field}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium"
              >
                {field}
              </span>
            ))}
            {remainingFields > 0 && (
              <span className="text-xs text-gray-400">+{remainingFields}</span>
            )}
          </div>
        )}

        {/* Countries */}
        {scholarship.eligibleCountries.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            {scholarship.eligibleCountries.slice(0, 2).map((c) => (
              <span
                key={c}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium"
              >
                {c}
              </span>
            ))}
            {scholarship.eligibleCountries.length > 2 && (
              <span className="text-xs text-gray-400">+{scholarship.eligibleCountries.length - 2}</span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Deadline */}
        <div className="flex items-center gap-2 py-3 border-t border-gray-100">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">Deadline:</span>
          <Badge variant={deadlineBadgeVariant} size="sm">
            {formatDate(scholarship.deadline, 'short')}
          </Badge>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 space-y-2">
        <Link href={`/scholarships/detail?id=${scholarship.id}`} className="block w-full">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
            View Details
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </Link>
        {scholarship.status === 'pending' && (
          <Link href={`/scholarships/detail?id=${scholarship.id}`} className="block w-full">
            <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-700 text-sm font-semibold transition-all duration-200">
              <Bell className="w-3.5 h-3.5" />
              Notify Me
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
