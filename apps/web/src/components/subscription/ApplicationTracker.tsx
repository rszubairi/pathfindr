'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ApplicationTrackerProps {
  used: number;
  limit: number;
  tier: 'pro' | 'expert';
  className?: string;
}

export function ApplicationTracker({
  used,
  limit,
  tier,
  className,
}: ApplicationTrackerProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const remaining = Math.max(limit - used, 0);
  const isNearLimit = percentage >= 80;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">Applications used</span>
        <span className={cn('font-semibold', isNearLimit ? 'text-yellow-600' : 'text-gray-900')}>
          {used} / {limit}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            isNearLimit ? 'bg-yellow-500' : 'bg-primary-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">
        {remaining} application{remaining !== 1 ? 's' : ''} remaining on{' '}
        <span className="font-medium capitalize">{tier}</span> plan
      </p>
    </div>
  );
}
