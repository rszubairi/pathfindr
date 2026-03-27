'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, BookOpen, GraduationCap, DollarSign, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { InternationalSchool } from '@/types';

export interface InternationalSchoolCardProps {
  school: InternationalSchool;
}

const countryColors: Record<string, { bg: string; text: string; border: string; gradient: string; flag: string }> = {
  Malaysia: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'linear-gradient(90deg,#3b82f6,#06b6d4)', flag: '🇲🇾' },
  Indonesia: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', gradient: 'linear-gradient(90deg,#ef4444,#f97316)', flag: '🇮🇩' },
  China: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'linear-gradient(90deg,#f59e0b,#ef4444)', flag: '🇨🇳' },
};

const curriculumColors: Record<string, { bg: string; text: string }> = {
  IB: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  IGCSE: { bg: 'bg-purple-50', text: 'text-purple-700' },
  'A-Levels': { bg: 'bg-violet-50', text: 'text-violet-700' },
  AP: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Cambridge: { bg: 'bg-teal-50', text: 'text-teal-700' },
  American: { bg: 'bg-sky-50', text: 'text-sky-700' },
  Singapore: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

export function InternationalSchoolCard({ school }: InternationalSchoolCardProps) {
  const { t } = useTranslation();
  const colors = countryColors[school.country] || countryColors['Malaysia'];

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: colors.gradient }} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header: country badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl border ${colors.border} ${colors.bg} flex items-center justify-center flex-shrink-0 shadow-sm text-xl`}>
            {colors.flag}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
              {school.country}
            </span>
          </div>
        </div>

        {/* School name */}
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors duration-200">
          {school.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600">{school.city}, {school.country}</span>
        </div>

        {/* Curriculum */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <BookOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          {school.curriculum.map((c) => {
            const cColors = curriculumColors[c] || { bg: 'bg-gray-50', text: 'text-gray-700' };
            return (
              <span key={c} className={`inline-block ${cColors.bg} ${cColors.text} text-xs px-2 py-0.5 rounded-full font-medium`}>
                {c}
              </span>
            );
          })}
        </div>

        {/* Grades */}
        <div className="flex items-center gap-1.5 mb-2">
          <GraduationCap className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600">{school.grades}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Fees */}
        <div className="flex items-center gap-2 py-3 border-t border-gray-100">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">{t('internationalSchools.card.fees')}</span>
          <Badge variant="default" size="sm">
            {school.annualFees}
          </Badge>
        </div>
      </div>

      {/* Footer - Visit Website button */}
      <div className="px-5 pb-5">
        <a
          href={school.website}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {t('internationalSchools.card.visitWebsite')}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
