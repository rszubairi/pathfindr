'use client';

import React from 'react';
import { Search, Target, Globe, Award, TrendingUp, Shield } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';


export function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Search,
      title: t('home.features.list.smartSearch.title'),
      description: t('home.features.list.smartSearch.desc'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Target,
      title: t('home.features.list.personalized.title'),
      description: t('home.features.list.personalized.desc'),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Globe,
      title: t('home.features.list.global.title'),
      description: t('home.features.list.global.desc'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Award,
      title: t('home.features.list.verified.title'),
      description: t('home.features.list.verified.desc'),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: TrendingUp,
      title: t('home.features.list.tracking.title'),
      description: t('home.features.list.tracking.desc'),
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Shield,
      title: t('home.features.list.secure.title'),
      description: t('home.features.list.secure.desc'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <Container size="xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                variant="default"
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="pt-6">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-xl mb-4`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
