'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfileComplete?: boolean;
  requiredRole?: UserRole | UserRole[];
}

export function ProtectedRoute({
  children,
  requireProfileComplete = false,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, profileCompleted, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requireProfileComplete && !profileCompleted && user?.role === 'student') {
        router.push('/profile/complete');
      } else if (requiredRole && user) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!allowedRoles.includes(user.role as UserRole)) {
          router.push('/');
        }
      }
    }
  }, [isAuthenticated, profileCompleted, loading, requireProfileComplete, requiredRole, user, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requireProfileComplete && !profileCompleted) return null;
  if (requiredRole && user) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user.role as UserRole)) return null;
  }

  return <>{children}</>;
}
