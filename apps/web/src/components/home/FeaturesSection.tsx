import React from 'react';
import { Search, Target, Globe, Award, TrendingUp, Shield } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description:
      'Advanced filters to find scholarships that match your profile, field of study, and destination country.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Target,
    title: 'Personalized Matching',
    description:
      'AI-powered recommendations based on your academic background, interests, and career goals.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Globe,
    title: 'Global Opportunities',
    description:
      'Access scholarships from 50+ countries across Southeast Asia, North America, Europe, and beyond.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Award,
    title: 'Verified Listings',
    description:
      'All scholarships are verified and updated regularly to ensure accuracy and reliability.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    icon: TrendingUp,
    title: 'Application Tracking',
    description:
      'Keep track of your scholarship applications, deadlines, and progress in one centralized dashboard.',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your personal information is protected with enterprise-grade security and never shared without permission.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <Container size="xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pathfindr provides powerful tools and resources to help you discover and secure your
            perfect scholarship opportunity.
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
