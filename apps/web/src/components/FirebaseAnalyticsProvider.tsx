'use client';

import { useEffect } from 'react';
import { getFirebaseAnalytics } from '@/lib/firebase';

export function FirebaseAnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getFirebaseAnalytics();
  }, []);

  return <>{children}</>;
}
