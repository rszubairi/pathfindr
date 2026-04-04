import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width, height, borderRadius, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius: borderRadius ?? 4,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function CourseCardSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[styles.courseCard, { backgroundColor: colors.surface }]}>
      <Skeleton width="100%" height={120} borderRadius={0} />
      <View style={styles.courseInfo}>
        <View style={styles.badgeRow}>
          <Skeleton width={50} height={18} borderRadius={4} />
          <Skeleton width={40} height={14} borderRadius={4} />
        </View>
        <Skeleton width="90%" height={16} style={{ marginTop: 10 }} />
        <Skeleton width="70%" height={16} style={{ marginTop: 6 }} />
        <Skeleton width="40%" height={12} style={{ marginTop: 10 }} />
      </View>
    </View>
  );
}

export function FeatureCardSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
      <Skeleton width={56} height={56} borderRadius={12} />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Skeleton width="60%" height={18} />
        <Skeleton width="90%" height={14} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  courseCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  courseInfo: {
    padding: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
});
