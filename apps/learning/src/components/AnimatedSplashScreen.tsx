import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import { useTheme } from '../theme';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

export function AnimatedSplashScreen({ onAnimationComplete }: AnimatedSplashScreenProps) {
  const { colors, isDark } = useTheme();

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
    // Hard deadline: dismiss after 5s regardless — covers JS thread congestion on device
    const safetyTimeout = setTimeout(finishAnimation, 5000);

    Animated.stagger(150, [
      Animated.spring(circle1Scale, { toValue: 1, damping: 15, useNativeDriver: true }),
      Animated.spring(circle2Scale, { toValue: 1, damping: 15, useNativeDriver: true }),
      Animated.spring(circle3Scale, { toValue: 1, damping: 15, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, damping: 12, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(logoTranslateY, { toValue: 0, damping: 14, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(textTranslateY, { toValue: 0, damping: 14, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(1000),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(taglineTranslateY, { toValue: 0, damping: 14, useNativeDriver: true }),
      ]),
    ]).start();

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

    Animated.sequence([
      Animated.delay(2400),
      Animated.timing(overallOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      clearTimeout(safetyTimeout);
      finishAnimation();
    });

    return () => {
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.surface, opacity: overallOpacity }]} pointerEvents="none">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />

      <Animated.View
        style={[
          styles.circle, styles.circle1, { backgroundColor: colors.primary },
          { transform: [{ scale: circle1Scale }], opacity: circle1Scale.interpolate({ inputRange: [0, 1], outputRange: [0, 0.06] }) },
        ]}
      />
      <Animated.View
        style={[
          styles.circle, styles.circle2, { backgroundColor: colors.primary },
          { transform: [{ scale: circle2Scale }], opacity: circle2Scale.interpolate({ inputRange: [0, 1], outputRange: [0, 0.04] }) },
        ]}
      />
      <Animated.View
        style={[
          styles.circle, styles.circle3, { backgroundColor: colors.primary },
          { transform: [{ scale: circle3Scale }], opacity: circle3Scale.interpolate({ inputRange: [0, 1], outputRange: [0, 0.03] }) },
        ]}
      />

      <View style={styles.content}>
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
            style={[styles.logo, colors.logoTint ? { tintColor: colors.logoTint } : {}]}
            resizeMode="contain"
          />
          <Animated.View
            style={[
              styles.shimmer, { backgroundColor: colors.surface },
              { transform: [{ translateX: shimmerTranslateX }], opacity: shimmerOpacity },
            ]}
          />
        </Animated.View>

        <Animated.Text
          style={[
            styles.brandName, { color: colors.text },
            { opacity: textOpacity, transform: [{ translateY: textTranslateY }] },
          ]}
        >
          Pathfindr
        </Animated.Text>

        <Animated.Text
          style={[
            styles.tagline, { color: colors.textMuted },
            { opacity: taglineOpacity, transform: [{ translateY: taglineTranslateY }] },
          ]}
        >
          Your path to academic excellence
        </Animated.Text>
      </View>

      <View style={styles.bottomSection}>
        <Animated.View
          style={[styles.dots, { opacity: taglineOpacity, transform: [{ translateY: taglineTranslateY }] }]}
        >
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, { backgroundColor: colors.border }, i === 1 && { backgroundColor: colors.primary, width: 24 }]} />
          ))}
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
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
    width: width * 0.3,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
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
  },
});
