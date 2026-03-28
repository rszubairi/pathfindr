import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import './src/lib/i18n';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AnimatedSplashScreen } from './src/components/AnimatedSplashScreen';
import { ThemeProvider, useTheme } from './src/theme';

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL as string
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 2,
    },
  },
});

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <Provider store={store}>
      <ConvexProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <SafeAreaProvider>
              <AppContent showSplash={showSplash} onSplashComplete={handleSplashComplete} />
            </SafeAreaProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ConvexProvider>
    </Provider>
  );
}

function AppContent({ showSplash, onSplashComplete }: { showSplash: boolean; onSplashComplete: () => void }) {
  const { isDark } = useTheme();
  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
