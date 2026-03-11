'use client';

import { AdminSidebar } from './AdminSidebar';
import { MainLayout } from '../layout/MainLayout';
import { ProtectedRoute } from '../auth/ProtectedRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute requiredRole="admin">
      <MainLayout showFooter={false}>
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
          <AdminSidebar />
          <main className="flex-1 w-full max-w-7xl mx-auto overflow-x-hidden">
            <div className="p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
