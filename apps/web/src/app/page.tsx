import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { LazyHomeContent } from '@/components/home/LazyHomeContent';

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
      {/* 
        Above the fold - Priority Content
        Rendered immediately to ensure super fast LCP (Largest Contentful Paint) 
      */}
      <HeroSection />

      {/* 
        Below the fold - Lazy Loaded
        Wait 1 second then load and hydrate the rest of the page 
      */}
      <LazyHomeContent />
    </MainLayout>
  );
}
