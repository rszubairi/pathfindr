'use client';

import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { useState } from 'react';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';

export function Providers({ children }: { children: React.ReactNode }) {
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

  return (
    <Provider store={store}>
      <ConvexClientProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ConvexClientProvider>
    </Provider>
  );
}
