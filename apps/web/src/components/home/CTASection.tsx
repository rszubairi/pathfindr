'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <Container size="xl">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-primary-50">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              <Link href="/register">
                {t('home.cta.createAccount')}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-white border-2 border-white hover:bg-white/10">
              <Link href="/scholarships">
                {t('home.cta.browseScholarships')}
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
