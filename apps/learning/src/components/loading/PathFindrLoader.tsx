import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme, ThemeColors } from '../../theme';

const { width } = Dimensions.get('window');

export const PathFindrLoader = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const float = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const glowScale = useRef(new Animated.Value(1)).current;

  // Title entrance animations
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(16)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(10)).current;
  const subtitleLetterSpacing = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -10, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.6, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.3, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowScale, { toValue: 1.3, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowScale, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Staggered title entrance: "PathFindr" slides up first, then "Learning" fans in
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(titleTranslateY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(subtitleTranslateY, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(subtitleLetterSpacing, { toValue: 3, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />

      <Animated.View style={{ transform: [{ translateY: float }, { scale }] }}>
        <Svg width="120" height="120" viewBox="0 0 100 100">
          <Path
            d="M50 25L15 42L50 59L85 42L50 25Z"
            fill={colors.primary}
            stroke={colors.primary}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Path
            d="M30 52V62C30 62 40 70 50 70C60 70 70 62 70 62V52"
            fill="none"
            stroke={colors.primary}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Path
            d="M85 42V55C85 55 83 60 81 60"
            fill="none"
            stroke={colors.primary}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Rect x="79" y="60" width="4" height="6" rx="1" fill={colors.primary} />
        </Svg>
      </Animated.View>

      <View style={styles.textContainer}>
        <Animated.Text style={[styles.brandText, { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }]}>
          PathFindr
        </Animated.Text>
        <Animated.Text style={[styles.subtitleText, { opacity: subtitleOpacity, transform: [{ translateY: subtitleTranslateY }], letterSpacing: subtitleLetterSpacing }]}>
          LEARNING
        </Animated.Text>
        <View style={styles.dotContainer}>
          {[0, 1, 2].map((i) => (
            <Dot key={i} index={i} colors={colors} />
          ))}
        </View>
      </View>
    </View>
  );
};

const Dot = ({ index, colors }: { index: number; colors: ThemeColors }) => {
  const styles = createStyles(colors);
  const dotScale = useRef(new Animated.Value(1)).current;
  const dotOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const delay = index * 200;
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.sequence([
            Animated.timing(dotScale, { toValue: 1.5, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(dotScale, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(dotOpacity, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(dotOpacity, { toValue: 0.4, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ]),
        ]),
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.dot, { transform: [{ scale: dotScale }], opacity: dotOpacity }]} />;
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  brandText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
