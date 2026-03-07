import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

export function ScholarshipDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <Container size="xl">
          <div className="h-4 bg-gray-200 rounded w-64" />
        </Container>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-10">
        <Container size="xl">
          <div className="h-6 w-24 bg-gray-200 rounded-full mb-4" />
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded" />
            <div className="h-5 bg-gray-200 rounded w-48" />
          </div>
        </Container>
      </section>

      {/* Key Info Bar */}
      <section className="py-6 border-b border-gray-200">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-28" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Action Row */}
      <section className="py-6">
        <Container size="xl">
          <div className="flex gap-4">
            <div className="h-12 bg-gray-200 rounded-lg w-40" />
            <div className="h-12 bg-gray-200 rounded-lg w-28" />
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-8">
        <Container size="xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <div className="h-7 bg-gray-200 rounded w-32 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
              <div>
                <div className="h-7 bg-gray-200 rounded w-48 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-5 bg-gray-200 rounded w-32" />
                      <div className="h-5 bg-gray-200 rounded w-48" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-36 mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded-full w-24" />
                    ))}
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-32 mt-4 mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded-full w-28" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
