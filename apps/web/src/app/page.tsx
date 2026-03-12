import type { Metadata } from 'next';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FeaturedScholarshipsSection } from '@/components/home/FeaturedScholarshipsSection';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Pathfindr - Your Path to Global Educational Opportunities',
  description:
    'Connect with thousands of scholarships, universities, internships, and job opportunities across Southeast Asia and beyond. Start your educational journey today.',
  keywords: [
    'scholarships',
    'study abroad',
    'international education',
    'Southeast Asia',
    'student opportunities',
    'university programs',
    'internships',
  ],
  openGraph: {
    title: 'Pathfindr - Your Path to Global Educational Opportunities',
    description:
      'Connect with thousands of scholarships, universities, internships, and job opportunities across Southeast Asia and beyond.',
    type: 'website',
  },
};

import { CTASection } from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Scholarships Section */}
      <FeaturedScholarshipsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </MainLayout>
  );
}
