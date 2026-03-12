'use client';

import React from 'react';
import { BookOpen, Globe, Users, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useTranslation } from 'react-i18next';


export function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: BookOpen,
      value: '10,000+',
      label: t('home.stats.scholarships.label'),
      description: t('home.stats.scholarships.desc'),
    },
    {
      icon: Globe,
      value: '50+',
      label: t('home.stats.countries.label'),
      description: t('home.stats.countries.desc'),
    },
    {
      icon: Users,
      value: '5,000+',
      label: t('home.stats.students.label'),
      description: t('home.stats.students.desc'),
    },
    {
      icon: TrendingUp,
      value: '$50M+',
      label: t('home.stats.awarded.label'),
      description: t('home.stats.awarded.desc'),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <Container size="xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-200"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4 group-hover:bg-primary-200 transition-colors">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>

                {/* Value */}
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>

                {/* Label */}
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>

                {/* Description */}
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
