import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setCurrentLesson, setIsPlaying, setCurrentTime, completeLesson } from '../../store/slices/learningSlice';
import { useTheme } from '../../theme';
import { RootStackParamList } from '../../navigation/RootNavigator';

type CoursePlayerRouteProp = RouteProp<RootStackParamList, 'CoursePlayer'>;

export function CoursePlayerScreen() {
    const route = useRoute<CoursePlayerRouteProp>();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { currentLesson, isPlaying, currentTime } = useSelector((state: RootState) => state.learning);

    const { courseId, enrollmentId, lessonIndex = 0 } = route.params;

    const [showBreakpoint, setShowBreakpoint] = useState(false);
    const [currentBreakpoint, setCurrentBreakpoint] = useState<any>(null);

    // Mock lesson data (will be replaced with actual Convex data)
    const mockLesson = {
        id: 'lesson_1',
        courseId: courseId,
        title: 'Introduction to the Topic',
        description: 'Learn the basics',
        sequenceOrder: 1,
        script: 'Welcome to this lesson...',
        duration: 15,
        status: 'published' as const,
        createdAt: new Date().toISOString(),
        breakpoints: [
            { timestamp: 30, type: 'question' as const, content: 'What do you think will happen next?', correctAnswer: 'Option A', options: ['Option A', 'Option B', 'Option C'] },
            { timestamp: 90, type: 'hint' as const, content: 'Remember what we learned earlier about...' },
            { timestamp: 150, type: 'summary' as const, content: "Let's recap what we've learned so far..." },
        ],
    };

    useEffect(() => {
        dispatch(setCurrentLesson(mockLesson));
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout>;
        if (isPlaying && !showBreakpoint) {
            interval = setInterval(() => {
                dispatch(setCurrentTime(currentTime + 1));

                // Check for breakpoints
                const breakpoint = mockLesson.breakpoints.find((b) => b.timestamp === currentTime);
                if (breakpoint) {
                    dispatch(setIsPlaying(false));
                    setCurrentBreakpoint(breakpoint);
                    setShowBreakpoint(true);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentTime, showBreakpoint]);

    const handleBreakpointResponse = (response?: string) => {
        // Log the interaction (will be sent to Convex)
        console.log('Breakpoint response:', response);

        // Complete the lesson if at the end
        if (currentTime >= mockLesson.duration * 60) {
            dispatch(completeLesson({ lessonId: mockLesson.id, score: 100 }));
        }

        setShowBreakpoint(false);
        setCurrentBreakpoint(null);
        dispatch(setIsPlaying(true));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.videoContainer, { backgroundColor: colors.surface }]}>
                <Text style={[styles.videoPlaceholder, { color: colors.textMuted }]}>
                    Video Player
                </Text>
                <Text style={[styles.lessonTitle, { color: colors.text }]}>
                    {currentLesson?.title || 'Loading...'}
                </Text>
            </View>

            <View style={[styles.controls, { backgroundColor: colors.surface }]}>
                <Text style={[styles.timeDisplay, { color: colors.text }]}>
                    {formatTime(currentTime)} / {formatTime(mockLesson.duration * 60)}
                </Text>

                <TouchableOpacity
                    style={[styles.playButton, { backgroundColor: colors.primary }]}
                    onPress={() => dispatch(setIsPlaying(!isPlaying))}
                >
                    <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
                </TouchableOpacity>
            </View>

            {showBreakpoint && currentBreakpoint && (
                <View style={[styles.breakpointOverlay, { backgroundColor: colors.overlay }]}>
                    <View style={[styles.breakpointCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.breakpointType, { color: colors.primary }]}>
                            {currentBreakpoint.type.toUpperCase()}
                        </Text>
                        <Text style={[styles.breakpointContent, { color: colors.text }]}>
                            {currentBreakpoint.content}
                        </Text>

                        {currentBreakpoint.options && (
                            <View style={styles.optionsContainer}>
                                {currentBreakpoint.options.map((option: string, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.optionButton, { borderColor: colors.border }]}
                                        onPress={() => handleBreakpointResponse(option)}
                                    >
                                        <Text style={[styles.optionText, { color: colors.text }]}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {!currentBreakpoint.options && (
                            <TouchableOpacity
                                style={[styles.continueButton, { backgroundColor: colors.primary }]}
                                onPress={() => handleBreakpointResponse()}
                            >
                                <Text style={styles.continueButtonText}>Continue</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 16,
        borderRadius: 12,
    },
    videoPlaceholder: {
        fontSize: 18,
        marginBottom: 16,
    },
    lessonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        margin: 16,
        borderRadius: 12,
    },
    timeDisplay: {
        fontSize: 16,
        fontFamily: 'monospace',
    },
    playButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    playButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    breakpointOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    breakpointCard: {
        width: '85%',
        padding: 24,
        borderRadius: 16,
    },
    breakpointType: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    breakpointContent: {
        fontSize: 18,
        marginBottom: 20,
        lineHeight: 26,
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        padding: 16,
        borderWidth: 2,
        borderRadius: 8,
    },
    optionText: {
        fontSize: 16,
    },
    continueButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CoursePlayerScreen;