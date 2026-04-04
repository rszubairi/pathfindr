import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';

// @react-native-voice/voice requires a native build — gracefully stub it out in Expo Go
let Voice: any = null;
try {
    Voice = require('@react-native-voice/voice').default;
} catch {
    // not available in Expo Go
}
type SpeechResultsEvent = { value?: string[] };
type SpeechErrorEvent = { error?: any };
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface VoiceInterfaceProps {
    onSpeechResult: (text: string) => void;
    isActive: boolean;
}

export function VoiceInterface({ onSpeechResult, isActive }: VoiceInterfaceProps) {
    const { colors } = useTheme();
    const [isListening, setIsListening] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    const [animationValue] = useState(new Animated.Value(0));

    useEffect(() => {
        if (!Voice) return;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => {
        if (isListening) {
            startPulse();
        } else {
            animationValue.setValue(0);
        }
    }, [isListening]);

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animationValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(animationValue, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value && e.value.length > 0) {
            setRecognizedText(e.value[0]);
            onSpeechResult(e.value[0]);
        }
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
        console.error('STT Error:', e.error);
        setIsListening(false);
    };

    const startListening = async () => {
        if (!Voice) return;
        try {
            setRecognizedText('');
            await Voice.start('en-US');
            setIsListening(true);
        } catch (error) {
            console.error('Error starting Voice:', error);
        }
    };

    const stopListening = async () => {
        if (!Voice) return;
        try {
            await Voice.stop();
            setIsListening(false);
        } catch (error) {
            console.error('Error stopping Voice:', error);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    if (!isActive) return null;

    const scale = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2],
    });

    const opacity = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View style={styles.container}>
            {isListening && (
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                    {recognizedText || 'Listening...'}
                </Text>
            )}
            
            <View style={styles.voiceControls}>
                {isListening && (
                    <Animated.View 
                        style={[
                            styles.pulseCircle, 
                            { 
                                backgroundColor: colors.primary, 
                                transform: [{ scale }],
                                opacity 
                            }
                        ]} 
                    />
                )}
                <TouchableOpacity
                    style={[
                        styles.micButton, 
                        { backgroundColor: isListening ? colors.error : colors.primary }
                    ]}
                    onPress={toggleListening}
                >
                    <Feather 
                        name={isListening ? "square" : "mic"} 
                        size={28} 
                        color="#ffffff" 
                    />
                </TouchableOpacity>
            </View>
            
            <Text style={[styles.hintText, { color: colors.textMuted }]}>
                {isListening ? 'Tap to finish' : 'Tap to speak your answer'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 12,
    },
    statusText: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 8,
        textAlign: 'center',
    },
    voiceControls: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
    },
    micButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        zIndex: 2,
    },
    pulseCircle: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        zIndex: 1,
    },
    hintText: {
        fontSize: 12,
        fontWeight: '500',
    },
});
