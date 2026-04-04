import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../theme';

interface VoiceWaveformProps {
    isSpeaking: boolean;
}

const BAR_COUNT = 5;

export function VoiceWaveform({ isSpeaking }: VoiceWaveformProps) {
    const { colors } = useTheme();
    const animValues = useRef(
        Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.2))
    ).current;

    useEffect(() => {
        if (isSpeaking) {
            animValues.forEach((anim, index) => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(anim, {
                            toValue: 1,
                            duration: 400 + index * 100,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                            useNativeDriver: false,
                        }),
                        Animated.timing(anim, {
                            toValue: 0.2,
                            duration: 400 + index * 100,
                            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                            useNativeDriver: false,
                        }),
                    ])
                ).start();
            });
        } else {
            animValues.forEach((anim) => {
                anim.stopAnimation();
                Animated.timing(anim, {
                    toValue: 0.2,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            });
        }
    }, [isSpeaking]);

    return (
        <View style={styles.container}>
            {animValues.map((anim, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.bar,
                        {
                            height: anim.interpolate({ inputRange: [0, 1], outputRange: [4, 40] }),
                            backgroundColor: index % 2 === 0 ? colors.primary : colors.success,
                            opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
                        },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        gap: 6,
    },
    bar: {
        width: 6,
        borderRadius: 3,
    },
});
