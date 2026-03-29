'use client';

import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function KnowledgeBasePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {t('footer.links.knowledgeBase')}
        </h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg">
            This page is under construction. Check back soon for helpful articles and guides.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
