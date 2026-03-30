import { useCallback } from 'react';
import { logEvent } from 'firebase/analytics';
import { getFirebaseAnalytics } from '@/lib/firebase';

export function useAnalytics() {
  const track = useCallback(
    async (eventName: string, params?: Record<string, unknown>) => {
      const analytics = await getFirebaseAnalytics();
      if (analytics) {
        logEvent(analytics, eventName, params);
      }
    },
    []
  );

  return { track };
}
