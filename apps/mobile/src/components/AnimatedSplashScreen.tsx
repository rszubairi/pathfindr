import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

export function AnimatedSplashScreen({ onAnimationComplete }: AnimatedSplashScreenProps) {
  // Animation values using RN Animated
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(30)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(15)).current;

  const overallOpacity = useRef(new Animated.Value(1)).current;

  const circle1Scale = useRef(new Animated.Value(0)).current;
  const circle2Scale = useRef(new Animated.Value(0)).current;
  const circle3Scale = useRef(new Animated.Value(0)).current;

  const shimmerTranslateX = useRef(new Animated.Value(-width)).current;
  const shimmerOpacity = useRef(new Animated.Value(0)).current;

  const finishAnimation = useCallback(() => {
    onAnimationComplete();
  }, [onAnimationComplete]);

  useEffect(() => {
    // Safety timeout
    const safetyTimeout = setTimeout(finishAnimation, 4500);

    // Stage 1: Background circles (100-400ms)
    Animated.stagger(150, [
      Animated.spring(circle1Scale, { toValue: 1, damping: 15, useNativeDriver: true }),
      Animated.spring(circle2Scale, { toValue: 1, damping: 15, useNativeDriver: true }),
      Animated.spring(circle3Scale, { toValue: 1, damping: 15, useNativeDriver: true }),
    ]).start();

    // Stage 2: Logo (300ms delay)
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, damping: 12, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(logoTranslateY, { toValue: 0, damping: 14, useNativeDriver: true }),
      ]),
    ]).start();

    // Stage 3: Brand name (700ms delay)
    Animated.sequence([
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(textTranslateY, { toValue: 0, damping: 14, useNativeDriver: true }),
      ]),
    ]).start();

    // Stage 4: Tagline (1000ms delay)
    Animated.sequence([
      Animated.delay(1000),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(taglineTranslateY, { toValue: 0, damping: 14, useNativeDriver: true }),
      ]),
    ]).start();

    // Stage 5: Shimmer (1200ms delay)
    Animated.sequence([
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(shimmerTranslateX, { toValue: width, duration: 800, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(shimmerOpacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
          Animated.timing(shimmerOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
      ]),
    ]).start();

    // Stage 6: Fade out (2400ms delay)
    Animated.sequence([
      Animated.delay(2400),
      Animated.timing(overallOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      clearTimeout(safetyTimeout);
      finishAnimation();
    });

    return () => clearTimeout(safetyTimeout);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: overallOpacity }]} pointerEvents="none">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Decorative background circles */}
      <Animated.View
        style={[
          styles.circle, styles.circle1,
          { transform: [{ scale: circle1Scale }], opacity: circle1Scale.interpolate({ inputRange: [0, 1], outputRange: [0, 0.06] }) },
        ]}
      />
      <Animated.View
        style={[
          styles.circle, styles.circle2,
          { transform: [{ scale: circle2Scale }], opacity: circle2Scale.interpolate({ inputRange: [0, 1], outputRange: [0, 0.04] }) },
        ]}
      />
      <Animated.View
        style={[
          styles.circle, styles.circle3,
          { transform: [{ scale: circle3Scale }], opacity: circle3Scale.interpolate({ inputRange: [0, 1], outputRange: [0, 0.03] }) },
        ]}
      />

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { translateY: logoTranslateY }],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* Shimmer overlay */}
          <Animated.View
            style={[
              styles.shimmer,
              { transform: [{ translateX: shimmerTranslateX }], opacity: shimmerOpacity },
            ]}
          />
        </Animated.View>

        {/* Brand name */}
        <Animated.Text
          style={[
            styles.brandName,
            { opacity: textOpacity, transform: [{ translateY: textTranslateY }] },
          ]}
        >
          Pathfindr
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            { opacity: taglineOpacity, transform: [{ translateY: taglineTranslateY }] },
          ]}
        >
          Your path to academic excellence
        </Animated.Text>
      </View>

      {/* Bottom decoration */}
      <View style={styles.bottomSection}>
        <Animated.View
          style={[styles.dots, { opacity: taglineOpacity, transform: [{ translateY: taglineTranslateY }] }]}
        >
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
          ))}
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: '#2563eb',
  },
  circle1: {
    width: width * 1.5,
    height: width * 1.5,
    top: -width * 0.4,
    right: -width * 0.3,
  },
  circle2: {
    width: width * 1.2,
    height: width * 1.2,
    bottom: -width * 0.3,
    left: -width * 0.4,
  },
  circle3: {
    width: width * 0.8,
    height: width * 0.8,
    top: height * 0.35,
    left: -width * 0.2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: width * 0.4,
    height: width * 0.32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    width: width * 0.3,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  dotActive: {
    backgroundColor: '#2563eb',
    width: 24,
  },
});
