'use client';

import React, { useEffect, useState } from 'react';
import { Quote, Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';

// Base data that provides non-translatable fields
const testimonialsBaseData = [
  {
    name: 'Sarah Chen',
    scholarship: 'ASEAN Undergraduate Scholarship',
    photo: 'SC',
    rating: 5,
  },
  {
    name: 'Ahmad Rizki',
    scholarship: 'Melbourne International Scholarship',
    photo: 'AR',
    rating: 5,
  },
  {
    name: 'Maria Santos',
    scholarship: 'Thai Government Scholarship',
    photo: 'MS',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Get localized testimonials from i18n
  const localizedTestimonials = t('home.testimonials.list', { returnObjects: true }) as any[];

  return (
    <section className="py-20 bg-white">
      <Container size="xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('home.testimonials.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsBaseData.map((baseData, index) => {
            const localized = Array.isArray(localizedTestimonials) ? localizedTestimonials[index] : null;
            if (!localized) return null;

            return (
              <Card
                key={index}
                variant="default"
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="pt-6">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-primary-200" />
                  </div>

                  {/* Quote Text */}
                  <p className="text-gray-700 mb-6 leading-relaxed italic">&quot;{localized.quote}&quot;</p>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: baseData.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Student Info */}
                  <div className="flex items-center gap-3">
                    {/* Photo/Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-sm">
                      {baseData.photo}
                    </div>

                    {/* Details */}
                    <div>
                      <div className="font-semibold text-gray-900">{baseData.name}</div>
                      <div className="text-sm text-gray-600">
                        {localized.university}, {localized.country}
                      </div>
                      <div className="text-xs text-primary-600 font-medium">
                        {baseData.scholarship}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
