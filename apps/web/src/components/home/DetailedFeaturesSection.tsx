'use client';

import React from 'react';
import {
  Search,
  Target,
  Bell,
  BarChart,
  FileText,
  Shield,
  Check,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useTranslation } from 'react-i18next';

const detailedFeatures = [
  {
    icon: Search,
    title: 'Advanced Search & Filters',
    description:
      "Find exactly what you're looking for with powerful search capabilities and smart filters. Filter by country, field of study, value, and provider type.",
    benefits: [
      'Multi-criteria filtering',
      'Instant search results',
      'Saved search preferences',
    ],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Target,
    title: 'AI-Powered Matching',
    description:
      'Our intelligent matching algorithm analyzes your profile to recommend opportunities with the highest success probability.',
    benefits: [
      'Personalized recommendations',
      'Match score for each scholarship',
      'Smart priority ranking',
    ],
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    description:
      'Never miss a deadline. Get instant notifications for new scholarships matching your profile and upcoming deadlines.',
    benefits: [
      'Customizable preferences',
      'Deadline reminders',
      'Status change alerts',
    ],
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export function DetailedFeaturesSection() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-24 bg-white overflow-hidden">
      <Container size="xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Powerful tools and features designed to help you discover, track, and secure
            educational opportunities worldwide.
          </p>
        </div>

        <div className="space-y-32">
          {detailedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`grid md:grid-cols-2 gap-16 items-center ${
                  isEven ? '' : 'md:grid-flow-dense'
                }`}
              >
                {/* Text Content */}
                <div className={isEven ? 'md:order-1' : 'md:order-2'}>
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-8 shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-6">{feature.title}</h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-4">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual Side */}
                <div className={`${isEven ? 'md:order-2' : 'md:order-1'} relative`}>
                  <div
                    className={`bg-gradient-to-br ${feature.color} rounded-3xl h-[400px] flex items-center justify-center shadow-2xl relative z-10`}
                  >
                    <Icon className="h-40 w-40 text-white opacity-20" />
                  </div>
                  {/* Decorative blobs */}
                  <div className={`absolute -inset-4 bg-gradient-to-br ${feature.color} blur-2xl opacity-10 rounded-3xl`} />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
