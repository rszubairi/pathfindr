'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useTranslation } from 'react-i18next';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-24 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Container size="xl" className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 mb-6">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">
              {t('hero.badge')}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {t('hero.titlePart1')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              {t('hero.titlePart2')}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild variant="primary" size="lg" className="shadow-lg hover:shadow-xl">
              <Link href="/scholarships" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t('hero.browseBtn')}
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/about" className="flex items-center gap-2">
                {t('hero.learnMoreBtn')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-primary-700">
                  JD
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-secondary-700">
                  AK
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-primary-800">
                  ML
                </div>
              </div>
              <span className="font-medium">{t('hero.trustedBy')}</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="font-medium">{t('hero.available')}</span>
            <span className="text-gray-300">|</span>
            <span className="font-medium">{t('hero.countriesCount')}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
