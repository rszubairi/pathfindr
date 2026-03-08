import { Suspense } from 'react';
import { ScholarshipDetailContent } from './ScholarshipDetailContent';
import { ScholarshipDetailSkeleton } from '@/components/scholarships/ScholarshipDetailSkeleton';
import { MainLayout } from '@/components/layout/MainLayout';

export default function ScholarshipDetailPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <ScholarshipDetailSkeleton />
        </MainLayout>
      }
    >
      <ScholarshipDetailContent />
    </Suspense>
  );
}
