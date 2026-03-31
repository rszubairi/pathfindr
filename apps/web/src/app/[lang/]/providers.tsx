'use client';

import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { useState, useEffect } from 'react';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { FirebaseAnalyticsProvider } from '@/components/FirebaseAnalyticsProvider';
import i18n from '@/lib/i18n';

export function Providers({ 
  children,
  lang
}: { 
  children: React.ReactNode;
  lang: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync i18n with URL locale immediately to avoid "English flash" in header/footer
  // Call it synchronously here so it's ready for the Header/Footer during render
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <Provider store={store}>
      <ConvexClientProvider>
        <QueryClientProvider client={queryClient}>
          <FirebaseAnalyticsProvider>
            <ToastProvider>{children}</ToastProvider>
          </FirebaseAnalyticsProvider>
        </QueryClientProvider>
      </ConvexClientProvider>
    </Provider>
  );
}
