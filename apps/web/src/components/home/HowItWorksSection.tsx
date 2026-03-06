import React from 'react';
import { UserPlus, Search, FileCheck, Award } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Your Profile',
    description:
      'Sign up and tell us about your academic background, interests, and goals. The more we know, the better we can match you.',
  },
  {
    icon: Search,
    number: '02',
    title: 'Discover Opportunities',
    description:
      'Browse through thousands of scholarships using our smart filters or get personalized recommendations based on your profile.',
  },
  {
    icon: FileCheck,
    number: '03',
    title: 'Apply with Confidence',
    description:
      'Track your applications, manage deadlines, and access helpful resources to strengthen your submissions.',
  },
  {
    icon: Award,
    number: '04',
    title: 'Achieve Your Dreams',
    description:
      'Secure your scholarship and embark on your educational journey. Join our community of successful scholars.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <Container size="xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Pathfindr Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your journey to a global education starts here. Follow these simple steps to find and
            secure your perfect scholarship.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Lines (Desktop Only) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-primary-200 z-0"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative z-10">
                {/* Step Number */}
                <div className="text-6xl font-bold text-primary-100 mb-4">{step.number}</div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
