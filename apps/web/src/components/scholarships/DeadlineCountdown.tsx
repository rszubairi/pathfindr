'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { getRelativeDeadline, getDeadlineUrgency, isDeadlinePassed } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface DeadlineCountdownProps {
  deadline: string;
  className?: string;
}

export function DeadlineCountdown({ deadline, className }: DeadlineCountdownProps) {
  const urgency = getDeadlineUrgency(deadline);
  const passed = isDeadlinePassed(deadline);
  const relativeText = getRelativeDeadline(deadline);

  // Calculate days remaining
  const daysLeft = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const colorMap = {
    urgent: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'text-red-500',
      label: 'text-red-600',
    },
    soon: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: 'text-yellow-500',
      label: 'text-yellow-600',
    },
    normal: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: 'text-green-500',
      label: 'text-green-600',
    },
  };

  const passedColors = {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-500',
    icon: 'text-gray-400',
    label: 'text-gray-500',
  };

  const colors = passed ? passedColors : colorMap[urgency];

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border',
        colors.bg,
        colors.border,
        className
      )}
    >
      <Clock
        className={cn(
          'h-5 w-5 flex-shrink-0',
          colors.icon,
          !passed && urgency === 'urgent' && 'animate-pulse'
        )}
      />
      <div>
        <p className={cn('text-lg font-bold', colors.text)}>
          {passed ? 'Deadline Passed' : `${daysLeft} days left`}
        </p>
        <p className={cn('text-sm', colors.label)}>{relativeText}</p>
      </div>
    </div>
  );
}
