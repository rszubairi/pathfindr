import React from 'react';
import { BookOpen, Globe, Users, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const stats = [
  {
    icon: BookOpen,
    value: '10,000+',
    label: 'Scholarships Available',
    description: 'Diverse opportunities across all fields',
  },
  {
    icon: Globe,
    value: '50+',
    label: 'Countries',
    description: 'Global reach across Southeast Asia and beyond',
  },
  {
    icon: Users,
    value: '5,000+',
    label: 'Students Helped',
    description: 'Success stories from our community',
  },
  {
    icon: TrendingUp,
    value: '$50M+',
    label: 'Scholarships Awarded',
    description: 'Total value facilitated through our platform',
  },
];

export function StatsSection() {
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
