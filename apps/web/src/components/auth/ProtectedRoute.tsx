'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfileComplete?: boolean;
}

export function ProtectedRoute({
  children,
  requireProfileComplete = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, profileCompleted, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requireProfileComplete && !profileCompleted) {
        router.push('/profile/complete');
      }
    }
  }, [isAuthenticated, profileCompleted, loading, requireProfileComplete, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requireProfileComplete && !profileCompleted) return null;

  return <>{children}</>;
}
