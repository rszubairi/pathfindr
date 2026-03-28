import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G, Rect } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing,
  interpolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

export const PathfindrLoader = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const float = useSharedValue(0);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    // Rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    );

    // Pulse animation
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Floating animation
    float.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Opacity pulse for the background glow
    opacity.value = withRepeat(
      withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(float.value, [0, 1], [0, -10]) },
        { scale: scale.value }
      ],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: interpolate(scale.value, [1, 1.1], [1, 1.3]) }]
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Glow */}
      <Animated.View style={[styles.glow, animatedGlowStyle]} />
      
      <Animated.View style={animatedLogoStyle}>
        <Svg width="120" height="120" viewBox="0 0 100 100">
          {/* Graduation Cap Main Part */}
          <Path
            d="M50 25L15 42L50 59L85 42L50 25Z"
            fill="#2563eb"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Graduation Cap Bottom Part */}
          <Path
            d="M30 52V62C30 62 40 70 50 70C60 70 70 62 70 62V52"
            fill="none"
            stroke="#2563eb"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Tassel */}
          <Path
            d="M85 42V55C85 55 83 60 81 60"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <Rect x="79" y="60" width="4" height="6" rx="1" fill="#2563eb" />
        </Svg>
      </Animated.View>
      
      <View style={styles.textContainer}>
        <Animated.Text style={styles.brandText}>Pathfindr</Animated.Text>
        <View style={styles.dotContainer}>
          {[0, 1, 2].map((i) => (
            <Dot key={i} index={i} />
          ))}
        </View>
      </View>
    </View>
  );
};

const Dot = ({ index }: { index: number }) => {
  const dotScale = useSharedValue(1);
  const dotOpacity = useSharedValue(0.4);

  useEffect(() => {
    dotScale.value = withDelay(
      index * 200,
      withRepeat(
        withTiming(1.5, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    dotOpacity.value = withDelay(
      index * 200,
      withRepeat(
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotOpacity.value,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
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
    backgroundColor: '#dbeafe',
    blurRadius: 20,
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  brandText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
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
    backgroundColor: '#2563eb',
  },
});
