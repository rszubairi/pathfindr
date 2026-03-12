'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import { ScholarshipSkeleton } from '@/components/scholarships/ScholarshipSkeleton';
import { useFeaturedScholarships } from '@/lib/convexQueries';
import { useTranslation } from 'react-i18next';

export function FeaturedScholarshipsSection() {
  const { t } = useTranslation();
  const { data: featuredScholarships, isLoading } = useFeaturedScholarships(4);

  return (
    <section className="py-20 bg-white">
      <Container size="xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('home.featured.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.featured.subtitle')}
          </p>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {isLoading ? (
            // Show loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <ScholarshipSkeleton key={index} />
            ))
          ) : (
            // Show actual scholarships
            featuredScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship._id}
                scholarship={{
                  ...scholarship,
                  id: scholarship._id,
                }}
              />
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button asChild variant="primary" size="lg">
            <Link href="/scholarships" className="flex items-center gap-2">
              {t('home.featured.viewAll')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
