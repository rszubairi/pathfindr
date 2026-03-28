'use client';

import React, { useState, useCallback } from 'react';
import { Calendar, MapPin, Users, ExternalLink, BookOpen, Building2, Bell, BellRing, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useRouter } from 'next/navigation';
import type { BoardingSchool } from '@/types';
import type { Id } from '../../../../../convex/_generated/dataModel';

export interface BoardingSchoolCardProps {
  school: BoardingSchool;
}

const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  'SBP Premier': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'linear-gradient(90deg,#f59e0b,#ef4444)' },
  'SMS': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'linear-gradient(90deg,#3b82f6,#6366f1)' },
  'SBPI': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'linear-gradient(90deg,#8b5cf6,#ec4899)' },
  'SMAP': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'linear-gradient(90deg,#10b981,#059669)' },
  'TMUA': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', gradient: 'linear-gradient(90deg,#14b8a6,#0d9488)' },
  'MRSM': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', gradient: 'linear-gradient(90deg,#6366f1,#3b82f6)' },
  'MRSM Premier': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', gradient: 'linear-gradient(90deg,#f43f5e,#e11d48)' },
};

const genderLabel: Record<string, string> = {
  male: 'Boys',
  female: 'Girls',
  mixed: 'Co-ed',
};

export function BoardingSchoolCard({ school }: BoardingSchoolCardProps) {
  const colors = categoryColors[school.category] || categoryColors['MRSM'];
  const isApplicationOpen = school.status === 'active' && school.deadline;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isSubscribed } = useSubscription();

  const isNotified = useQuery(
    api.boardingSchoolNotifications.hasUserSubscribed,
    user?._id ? { userId: user._id as Id<'users'>, schoolId: school._id as Id<'boardingSchools'> } : 'skip'
  );

  const subscribeMutation = useMutation(api.boardingSchoolNotifications.subscribe);
  const unsubscribeMutation = useMutation(api.boardingSchoolNotifications.unsubscribe);
  const [notifyLoading, setNotifyLoading] = useState(false);

  const handleNotifyToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=/boarding-schools`);
      return;
    }

    if (!isSubscribed) {
      router.push('/pricing');
      return;
    }

    setNotifyLoading(true);
    try {
      if (isNotified) {
        await unsubscribeMutation({ 
          userId: user?._id as Id<'users'>,
          schoolId: school._id as Id<'boardingSchools'>
        });
      } else {
        await subscribeMutation({
          userId: user?._id as Id<'users'>,
          schoolId: school._id as Id<'boardingSchools'>,
          email: user?.email || '',
        });
      }
    } catch (err) {
      console.error('Failed to update notification preference:', err);
    } finally {
      setNotifyLoading(false);
    }
  }, [isAuthenticated, isSubscribed, isNotified, user, school._id, subscribeMutation, unsubscribeMutation, router]);

  const deadlineBadgeVariant = (() => {
    if (!school.deadline) return 'default' as const;
    const days = Math.ceil((new Date(school.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'default' as const;
    if (days <= 7) return 'danger' as const;
    if (days <= 30) return 'warning' as const;
    return 'success' as const;
  })();

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: colors.gradient }} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header: category badge + managed by */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl border ${colors.border} ${colors.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Building2 className={`w-6 h-6 ${colors.text}`} />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
              {school.category}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
              {school.managedBy}
            </span>
          </div>
        </div>

        {/* School short name */}
        {school.shortName && (
          <p className="text-xs font-medium text-gray-500 mb-1">{school.shortName}</p>
        )}

        {/* School name */}
        <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors duration-200">
          {school.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600">{school.district}, {school.state}</span>
        </div>

        {/* Gender & Entry Levels */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
            {genderLabel[school.gender]}
          </span>
          {school.entryLevels.map((level) => (
            <span key={level} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
              {level}
            </span>
          ))}
        </div>

        {/* Special Programs */}
        {school.specialPrograms.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <BookOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            {school.specialPrograms.slice(0, 3).map((program) => (
              <span key={program} className={`inline-block ${colors.bg} ${colors.text} text-xs px-2 py-0.5 rounded-full font-medium`}>
                {program}
              </span>
            ))}
            {school.specialPrograms.length > 3 && (
              <span className="text-xs text-gray-400">+{school.specialPrograms.length - 3}</span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Application Period / Deadline */}
        <div className="flex items-center gap-2 py-3 border-t border-gray-100">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">Apply:</span>
          <Badge variant={deadlineBadgeVariant} size="sm">
            {school.applicationPeriod}
          </Badge>
        </div>
      </div>

      {/* Footer - Apply & Notify buttons */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-3">
        <button
          onClick={handleNotifyToggle}
          disabled={notifyLoading}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
            isNotified 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {notifyLoading ? (
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : isNotified ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Alerted
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5" />
              Notify
            </>
          )}
        </button>

        <a
          href={school.applicationPortal}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
            isApplicationOpen 
              ? 'bg-primary-600 hover:bg-primary-700 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {isApplicationOpen ? 'Apply' : 'Portal'}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

