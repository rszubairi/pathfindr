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
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <Container size="xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-primary-50">
              Create your profile today and unlock access to thousands of opportunities. Join our
              community of successful students achieving their dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Link href="/register">Create Free Account</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-white border-2 border-white hover:bg-white/10">
                <Link href="/scholarships">Browse Scholarships</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
