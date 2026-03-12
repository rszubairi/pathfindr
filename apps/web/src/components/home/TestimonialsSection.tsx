'use client';

import React from 'react';
import { Quote, Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';

const testimonials = [
  {
    name: 'Sarah Chen',
    university: 'National University of Singapore',
    country: 'Singapore',
    scholarship: 'ASEAN Undergraduate Scholarship',
    photo: 'SC',
    quote:
      "Pathfindr made finding the right scholarship so much easier. The personalized matching feature connected me with opportunities I didn't even know existed. Now I'm studying Computer Science at NUS!",
    rating: 5,
  },
  {
    name: 'Ahmad Rizki',
    university: 'University of Melbourne',
    country: 'Australia',
    scholarship: 'Melbourne International Scholarship',
    photo: 'AR',
    quote:
      "I was overwhelmed by the number of scholarships available until I found Pathfindr. The platform's smart filters and deadline tracking helped me stay organized and ultimately win a full scholarship to study Engineering.",
    rating: 5,
  },
  {
    name: 'Maria Santos',
    university: 'Chulalongkorn University',
    country: 'Thailand',
    scholarship: 'Thai Government Scholarship',
    photo: 'MS',
    quote:
      "As a first-generation college student, navigating scholarship applications was daunting. Pathfindr's verified listings and application tracking gave me the confidence to pursue my dreams. I'm now studying Medicine in Bangkok!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const { t } = useTranslation();

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
          {testimonials.map((testimonial, index) => (
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
                <p className="text-gray-700 mb-6 leading-relaxed italic">&quot;{testimonial.quote}&quot;</p>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-3">
                  {/* Photo/Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.photo}
                  </div>

                  {/* Details */}
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.university}, {testimonial.country}
                    </div>
                    <div className="text-xs text-primary-600 font-medium">
                      {testimonial.scholarship}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
