'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MainLayout } from '@/components/layout/MainLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="institution">
      <MainLayout showFooter={false}>
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
          <DashboardSidebar />
          <main className="flex-1 min-w-0">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
