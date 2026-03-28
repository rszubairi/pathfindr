'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  Target,
  Bell,
  Check,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useTranslation } from 'react-i18next';
import {
  SearchFiltersAnimation,
  AIMatchingAnimation,
  NotificationsAnimation,
} from './FeatureAnimations';

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
    Animation: SearchFiltersAnimation,
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
    Animation: AIMatchingAnimation,
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
    Animation: NotificationsAnimation,
  },
];

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

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
            const Animation = feature.Animation;
            const isEven = index % 2 === 0;

            return (
              <FeatureRow
                key={index}
                icon={Icon}
                Animation={Animation}
                title={feature.title}
                description={feature.description}
                benefits={feature.benefits}
                color={feature.color}
                isEven={isEven}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function FeatureRow({
  icon: Icon,
  Animation,
  title,
  description,
  benefits,
  color,
  isEven,
}: {
  icon: React.ComponentType<{ className?: string }>;
  Animation: React.ComponentType;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  isEven: boolean;
}) {
  const { ref, isVisible } = useInView(0.15);

  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${isEven ? '' : 'md:grid-flow-dense'}`}
    >
      {/* Text Content */}
      <div className={isEven ? 'md:order-1' : 'md:order-2'}>
        <div
          className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${color} rounded-2xl mb-8 shadow-lg`}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-3xl font-extrabold text-gray-900 mb-6">{title}</h3>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        <ul className="space-y-4">
          {benefits.map((benefit, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 text-gray-700 font-medium transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${0.3 + i * 0.15}s` }}
            >
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Visual Side - Animated SVG */}
      <div className={`${isEven ? 'md:order-2' : 'md:order-1'} relative`}>
        <div
          className={`bg-gradient-to-br ${color} rounded-3xl h-[400px] flex items-center justify-center shadow-2xl relative z-10 overflow-hidden`}
        >
          {isVisible && <Animation />}
        </div>
        {/* Decorative blobs */}
        <div className={`absolute -inset-4 bg-gradient-to-br ${color} blur-2xl opacity-10 rounded-3xl`} />
      </div>
    </div>
  );
}
