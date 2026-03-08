import React from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, Building2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate, getDeadlineUrgency } from '@/lib/utils';
import type { Scholarship } from '@/types';

export interface ScholarshipCardProps {
  scholarship: Scholarship;
  showMatchScore?: boolean;
}

export function ScholarshipCard({ scholarship, showMatchScore = false }: ScholarshipCardProps) {
  const deadlineUrgency = getDeadlineUrgency(scholarship.deadline);

  // Get badge variant based on deadline urgency
  const deadlineBadgeVariant =
    deadlineUrgency === 'urgent' ? 'danger' :
      deadlineUrgency === 'soon' ? 'warning' :
        'default';

  // Show first 2 countries, then count
  const displayCountries = scholarship.eligibleCountries.slice(0, 2);
  const remainingCountries = scholarship.eligibleCountries.length - 2;

  // Show first 2 fields, then count
  const displayFields = scholarship.eligibleFields.slice(0, 2);
  const remainingFields = scholarship.eligibleFields.length - 2;

  // Provider type label formatting
  const providerTypeLabel = scholarship.providerType.charAt(0).toUpperCase() + scholarship.providerType.slice(1);

  return (
    <Card
      variant="default"
      className="h-full flex flex-col hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
    >
      <CardContent className="flex-1 pt-6">
        {/* Header with provider type and match score */}
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" size="sm">
            {providerTypeLabel}
          </Badge>
          {showMatchScore && scholarship.matchScore && (
            <Badge variant="success" size="sm">
              {scholarship.matchScore}% Match
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {scholarship.name}
        </h3>

        {/* Provider */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Building2 className="h-4 w-4" />
          <span className="line-clamp-1">{scholarship.provider}</span>
        </div>

        {/* Value */}
        <div className="flex items-center gap-2 text-primary-600 font-semibold mb-4">
          <DollarSign className="h-5 w-5" />
          <span className="text-lg">
            {formatCurrency(scholarship.value, scholarship.currency)}
          </span>
        </div>

        {/* Countries */}
        {scholarship.eligibleCountries.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Eligible Countries</p>
            <div className="flex flex-wrap gap-1">
              {displayCountries.map((country) => (
                <Badge key={country} variant="primary" size="sm">
                  {country}
                </Badge>
              ))}
              {remainingCountries > 0 && (
                <Badge variant="primary" size="sm">
                  +{remainingCountries} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Fields of Study */}
        {scholarship.eligibleFields.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Fields of Study</p>
            <div className="flex flex-wrap gap-1">
              {displayFields.map((field) => (
                <Badge key={field} variant="secondary" size="sm">
                  {field}
                </Badge>
              ))}
              {remainingFields > 0 && (
                <Badge variant="secondary" size="sm">
                  +{remainingFields} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Deadline */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">Deadline:</span>
          <Badge variant={deadlineBadgeVariant} size="sm">
            {formatDate(scholarship.deadline, 'short')}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button asChild variant="primary" size="md" className="w-full">
          <Link href={`/scholarships/detail?id=${scholarship.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
