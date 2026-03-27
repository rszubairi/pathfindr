import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FeaturedScholarshipsSection } from '@/components/home/FeaturedScholarshipsSection';
import { DetailedFeaturesSection } from '@/components/home/DetailedFeaturesSection';
import { PricingSection } from '@/components/home/PricingSection';
import { CTASection } from '@/components/home/CTASection';

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

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Features Section (Merged from Features page) */}
      <DetailedFeaturesSection />

      {/* Featured Scholarships Section */}
      <FeaturedScholarshipsSection />

      {/* Pricing Section (Merged from Pricing page) */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </MainLayout>
  );
}
