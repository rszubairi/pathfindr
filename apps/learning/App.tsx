import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import * as Sentry from '@sentry/react-native';
import './src/lib/i18n';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AnimatedSplashScreen } from './src/components/AnimatedSplashScreen';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { ThemeProvider, useTheme } from './src/theme';

const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: sentryDsn,
  enableNativeNagger: false,
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,
  attachStacktrace: true,
  // Only enable when a valid DSN is configured — an empty DSN crashes the native SDK
  enabled: !__DEV__ && !!sentryDsn,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 2,
    },
  },
});

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const convex = useRef(new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL as string)).current;

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <ConvexProvider client={convex}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <SafeAreaProvider>
                <ErrorBoundary>
                  <AppContent showSplash={showSplash} onSplashComplete={handleSplashComplete} />
                </ErrorBoundary>
              </SafeAreaProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </ConvexProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

function AppContent({ showSplash, onSplashComplete }: { showSplash: boolean; onSplashComplete: () => void }) {
  const { isDark } = useTheme();
  return (
    <View style={styles.fill}>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </NavigationContainer>
      {showSplash && (
        <AnimatedSplashScreen onAnimationComplete={onSplashComplete} />
      )}
    </View>
  );
}

export default Sentry.wrap(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
});