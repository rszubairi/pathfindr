import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setCurrentLesson, setIsPlaying, setCurrentTime, completeLesson } from '../../store/slices/learningSlice';
import { useTheme } from '../../theme';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { aiTutor } from '../../services/aiTutor';
import { VoiceInterface } from '../../components/learning/VoiceInterface';
import { VoiceWaveform } from '../../components/learning/VoiceWaveform';
import * as Haptics from 'expo-haptics';

type CoursePlayerRouteProp = RouteProp<RootStackParamList, 'CoursePlayer'>;

type BreakpointPhase = 'question' | 'evaluating' | 'feedback_correct' | 'feedback_retry';

// ─── YouTube helpers ─────────────────────────────────────────────────────────

const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY ?? '';

async function searchYouTubeVideoId(query: string): Promise<string | null> {
    if (!YOUTUBE_API_KEY) return null;
    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=id&type=video&safeSearch=strict&videoEmbeddable=true&maxResults=1&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        return data.items?.[0]?.id?.videoId ?? null;
    } catch {
        return null;
    }
}

// YouTube iframe embed HTML with IFrame API bridge.
// Posts messages: { type: 'TIME', time: number } | { type: 'STATE', state: number }
// Listens for messages: { command: 'pause' } | { command: 'play' }
function buildYouTubeHTML(videoId: string, startSeconds: number = 0): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; background: #000; }
body, html { width: 100%; height: 100%; overflow: hidden; }
#player { width: 100%; height: 100%; border: none; }
</style>
</head>
<body>
<iframe id="player" 
    src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=1&modestbranding=1&rel=0&start=${startSeconds}&origin=https://www.youtube.com" 
    allow="autoplay; encrypted-media" 
    allowfullscreen>
</iframe>
<script>
var player;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        events: {
            onReady: function(e) { startTracking(); },
            onStateChange: function(e) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'STATE', state: e.data })); }
        }
    });
}
function startTracking() {
    setInterval(function() {
        if (player && player.getCurrentTime) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'TIME', time: Math.floor(player.getCurrentTime()) }));
        }
    }, 1000);
}
document.addEventListener('message', handleCommand);
window.addEventListener('message', handleCommand);
function handleCommand(e) {
    var msg;
    try { msg = JSON.parse(e.data); } catch(err) { return; }
    if (!player) return;
    if (msg.command === 'pause') player.pauseVideo();
    if (msg.command === 'play') player.playVideo();
}
</script>
</body>
</html>`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CoursePlayerScreen() {
    const route = useRoute<CoursePlayerRouteProp>();
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { currentLesson } = useSelector((state: RootState) => state.learning);
    const user = useSelector((state: RootState) => state.auth.user);

    const { courseId, enrollmentId, kidProfileId, lessonIndex = 0 } = route.params;

    const course = useQuery(api.courses.getCourseById, { courseId: courseId as Id<'courses'> });
    const lessons = useQuery(api.courses.getCourseLessons, { courseId: courseId as Id<'courses'> });
    const lesson = lessons?.[lessonIndex];

    const updateProgress = useMutation(api.enrollments.updateProgress);
    const logAiInteraction = useMutation(api.aiTutor.logInteraction);
    const assessment = useQuery(api.assessments.getAssessmentByCourse, { courseId: courseId as Id<'courses'> });
    
    // Analytics
    const startSession = useMutation(api.analytics.startSession);
    const updateHeartbeat = useMutation(api.analytics.updateHeartbeat);
    const endSession = useMutation(api.analytics.endSession);
    const [sessionId, setSessionId] = useState<Id<'learningSessions'> | null>(null);

    // YouTube state
    const [videoId, setVideoId] = useState<string | null>(null);
    const [videoLoading, setVideoLoading] = useState(true);
    const webviewRef = useRef<any>(null);
    const currentTimeRef = useRef(0);

    // Breakpoint state
    const [showBreakpoint, setShowBreakpoint] = useState(false);
    const [currentBreakpoint, setCurrentBreakpoint] = useState<any>(null);
    const [breakpointPhase, setBreakpointPhase] = useState<BreakpointPhase>('question');
    const [aiFeedback, setAiFeedback] = useState('');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const triggeredBreakpoints = useRef<Set<number>>(new Set());

    // Load lesson into Redux
    useEffect(() => {
        if (lesson) dispatch(setCurrentLesson(lesson as any));
    }, [lesson]);

    // Search YouTube when lesson loads
    useEffect(() => {
        if (!lesson) return;
        const query = `${lesson.title} ${course?.title ?? ''} educational`;
        setVideoLoading(true);
        searchYouTubeVideoId(query).then((id) => {
            setVideoId(id);
            setVideoLoading(false);
        });
        // Reset triggered breakpoints when lesson changes
        triggeredBreakpoints.current = new Set();
    }, [lesson?._id]);

    // Session Management
    useEffect(() => {
        if (lesson && user?.id && !sessionId) {
            startSession({
                userId: user.id as Id<'users'>,
                kidProfileId: kidProfileId as Id<'kidProfiles'>,
                courseId: courseId as Id<'courses'>,
                lessonId: lesson._id,
                platform: 'ios', // Hardcoded for this build, but should be dynamic
            }).then(id => setSessionId(id));
        }
        
        return () => {
            if (sessionId) {
                endSession({ sessionId });
            }
        };
    }, [lesson?._id]);

    // Heartbeat for time spent (every 15 seconds)
    useEffect(() => {
        if (!sessionId || showBreakpoint) return;

        const interval = setInterval(() => {
            updateHeartbeat({
                sessionId,
                incrementSeconds: 15,
            });
        }, 15000);

        return () => clearInterval(interval);
    }, [sessionId, showBreakpoint]);

    // ── WebView message handler (time + state updates from YouTube IFrame API) ──
    const handleWebViewMessage = useCallback((event: any) => {
        let msg: any;
        try { msg = JSON.parse(event.nativeEvent.data); } catch { return; }

        if (msg.type === 'TIME') {
            const t: number = msg.time;
            currentTimeRef.current = t;
            dispatch(setCurrentTime(t));

            // Trigger breakpoint if not already triggered
            if (!lesson || showBreakpoint) return;
            const idx = lesson.breakpoints.findIndex(
                (b: any) => Math.floor(b.timestamp) === t && !triggeredBreakpoints.current.has(b.timestamp)
            );
            if (idx !== -1) {
                triggeredBreakpoints.current.add(lesson.breakpoints[idx].timestamp);
                pauseVideo();
                dispatch(setIsPlaying(false));
                setCurrentBreakpoint({ ...lesson.breakpoints[idx], index: idx });
                setBreakpointPhase('question');
                setSelectedOption(null);
                setAiFeedback('');
                setShowBreakpoint(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                aiTutor.speak(lesson.breakpoints[idx].content, {
                    onStart: () => setIsAiSpeaking(true),
                    onDone: () => setIsAiSpeaking(false),
                });
            }
        }

        if (msg.type === 'STATE') {
            // YT.PlayerState: -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering, 5=cued
            if (msg.state === 0 && lesson && user?.id) {
                // Video ended — mark lesson complete and go to assessment if available
                updateProgress({
                    userId: user.id as Id<'users'>,
                    enrollmentId: enrollmentId as Id<'courseEnrollments'>,
                    lessonId: lesson._id,
                    score: 100,
                }).then(() => {
                    dispatch(completeLesson({ lessonId: lesson._id, score: 100 }));

                    if (assessment) {
                        navigation.navigate('Assessment', {
                            assessmentId: assessment._id,
                            courseId: courseId,
                            enrollmentId: enrollmentId,
                            kidProfileId: kidProfileId,
                        });
                    } else {
                        // No assessment, just go back
                        navigation.goBack();
                    }
                });
            }
        }
    }, [lesson, showBreakpoint, user]);

    const pauseVideo = () => webviewRef.current?.injectJavaScript(`handleCommand({data: JSON.stringify({command:'pause'})}); true;`);
    const resumeVideo = () => webviewRef.current?.injectJavaScript(`handleCommand({data: JSON.stringify({command:'play'})}); true;`);

    // ── Answer evaluation ─────────────────────────────────────────────────────
    const handleAnswer = async (response?: string) => {
        if (!lesson || !currentBreakpoint || !user?.id) return;

        aiTutor.stopSpeech();
        setIsAiSpeaking(false);
        setIsEvaluating(true);

        // For MCQ: compare directly to correctAnswer
        const correctAnswer: string | undefined = currentBreakpoint.correctAnswer;
        let isCorrect: boolean | undefined;
        if (correctAnswer !== undefined && response !== undefined) {
            isCorrect = response.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        }

        // Determine interaction type for AI context
        const interactionType = isCorrect === false ? 'correction' : isCorrect === true ? 'encouragement' : 'question';

        const aiEvaluation = await aiTutor.generateResponse(
            lesson._id,
            currentBreakpoint.index,
            lesson.script || '',
            interactionType,
            response
        );

        // Use direct MCQ check if available, otherwise trust AI
        const finalCorrect = isCorrect !== undefined ? isCorrect : aiEvaluation.isCorrect;

        await logAiInteraction({
            kidProfileId: kidProfileId as Id<'kidProfiles'>,
            lessonId: lesson._id,
            breakpointIndex: currentBreakpoint.index,
            interactionType,
            initiatedBy: 'system', // Breakpoints are system-initiated
            question: currentBreakpoint.content,
            userResponse: response,
            aiResponse: aiEvaluation.aiResponse,
            isCorrect: finalCorrect,
            scoreDelta: finalCorrect ? (currentBreakpoint.points ?? 10) : 0,
        });

        setIsEvaluating(false);
        setAiFeedback(aiEvaluation.aiResponse);

        if (finalCorrect) {
            setBreakpointPhase('feedback_correct');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            aiTutor.speak(aiEvaluation.aiResponse, {
                onStart: () => setIsAiSpeaking(true),
                onDone: () => setIsAiSpeaking(false),
            });
        } else {
            setBreakpointPhase('feedback_retry');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            aiTutor.speak(aiEvaluation.aiResponse, {
                onStart: () => setIsAiSpeaking(true),
                onDone: () => setIsAiSpeaking(false),
            });
        }
    };

    const handleRetry = () => {
        aiTutor.stopSpeech();
        setIsAiSpeaking(false);
        setSelectedOption(null);
        setAiFeedback('');
        setBreakpointPhase('question');
        aiTutor.speak(currentBreakpoint.content, {
            onStart: () => setIsAiSpeaking(true),
            onDone: () => setIsAiSpeaking(false),
        });
    };

    const handleContinue = () => {
        aiTutor.stopSpeech();
        setIsAiSpeaking(false);
        setShowBreakpoint(false);
        setCurrentBreakpoint(null);
        setIsAskingManual(false);
        setBreakpointPhase('question');
        dispatch(setIsPlaying(true));
        resumeVideo();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Manual Question Trigger
    const [isAskingManual, setIsAskingManual] = useState(false);
    const handleManualQuestion = async (text: string) => {
        if (!lesson || !user?.id) return;
        
        pauseVideo();
        setIsEvaluating(true);
        
        const aiResponse = await aiTutor.generateResponse(
            lesson._id,
            -1, // No specific breakpoint
            lesson.script || '',
            'explanation',
            text
        );

        await logAiInteraction({
            kidProfileId: kidProfileId as Id<'kidProfiles'>,
            lessonId: lesson._id,
            interactionType: 'student_question',
            initiatedBy: 'student',
            question: text,
            aiResponse: aiResponse.aiResponse,
        });

        setIsEvaluating(false);
        setAiFeedback(aiResponse.aiResponse);
        setIsAskingManual(false);
        // We reuse the breakpoint overlay but with a custom "Question" context
        setCurrentBreakpoint({
            type: 'student_question',
            content: text,
            index: -1,
        });
        setShowBreakpoint(true);
        setBreakpointPhase('feedback_correct'); // Reuse feedback state
        aiTutor.speak(aiResponse.aiResponse, {
            onStart: () => setIsAiSpeaking(true),
            onDone: () => setIsAiSpeaking(false),
        });
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]}>
            {/* ── Video area ── */}
            <View style={styles.videoContainer}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                        aiTutor.stopSpeech();
                        dispatch(setIsPlaying(false));
                        navigation.goBack();
                    }}
                >
                    <Feather name="x" size={20} color="#ffffff" />
                </TouchableOpacity>

                {videoLoading && (
                    <View style={styles.videoLoadingOverlay}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.videoLoadingText}>Finding video for this lesson…</Text>
                    </View>
                )}

                {!videoLoading && videoId ? (
                    <WebView
                        ref={webviewRef}
                        style={styles.webview}
                        source={{ 
                            html: buildYouTubeHTML(videoId, 0),
                            baseUrl: 'https://www.youtube.com'
                        }}
                        originWhitelist={['*']}
                        allowsInlineMediaPlayback
                        allowsFullscreenVideo={true}
                        mediaPlaybackRequiresUserAction={false}
                        javaScriptEnabled
                        onMessage={handleWebViewMessage}
                        onLoad={() => setVideoLoading(false)}
                    />
                ) : !videoLoading && !videoId ? (
                    <View style={styles.noVideoContainer}>
                        <Feather name="video-off" size={40} color="#666" />
                        <Text style={styles.noVideoText}>
                            {YOUTUBE_API_KEY
                                ? 'No video found for this lesson'
                                : 'Add EXPO_PUBLIC_YOUTUBE_API_KEY to enable videos'}
                        </Text>
                        <Text style={styles.lessonTitleText}>{currentLesson?.title}</Text>
                    </View>
                ) : null}
            </View>

            {/* ── Info bar ── */}
            <View style={[styles.infoBar, { backgroundColor: colors.surface }]}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.lessonLabel, { color: colors.textMuted }]}>
                        Lesson {lessonIndex + 1}
                    </Text>
                    <Text style={[styles.lessonName, { color: colors.text }]} numberOfLines={1}>
                        {currentLesson?.title ?? 'Loading…'}
                    </Text>
                </View>
                {lesson && (
                    <View style={styles.infoSummary}>
                        <TouchableOpacity 
                            style={[styles.askButton, { backgroundColor: colors.primary + '15' }]}
                            onPress={() => {
                                pauseVideo();
                                setIsAskingManual(true);
                                setShowBreakpoint(true);
                                setBreakpointPhase('question');
                                setCurrentBreakpoint({
                                    type: 'student_question',
                                    content: 'How can I help you?',
                                    index: -1
                                });
                                aiTutor.speak('How can I help you?', {
                                    onStart: () => setIsAiSpeaking(true),
                                    onDone: () => setIsAiSpeaking(false),
                                });
                            }}
                        >
                            <Feather name="help-circle" size={16} color={colors.primary} />
                            <Text style={[styles.askButtonText, { color: colors.primary }]}>Ask Question</Text>
                        </TouchableOpacity>
                        <Text style={[styles.timeText, { color: colors.textMuted }]}>
                            {formatTime(currentTimeRef.current)} / {formatTime(lesson.duration * 60)}
                        </Text>
                    </View>
                )}
            </View>

            {/* ── Breakpoint overlay ── */}
            {showBreakpoint && currentBreakpoint && (
                <View style={[styles.breakpointOverlay, { backgroundColor: 'rgba(0,0,0,0.75)' }]}>
                    <View style={[styles.breakpointCard, { backgroundColor: colors.surface }]}>

                        {/* Header */}
                        <View style={styles.breakpointHeader}>
                            <View style={[styles.breakpointBadge, { backgroundColor: colors.primary + '22' }]}>
                                <Feather name="zap" size={13} color={colors.primary} />
                                <Text style={[styles.breakpointBadgeText, { color: colors.primary }]}>
                                    {currentBreakpoint.type.toUpperCase()}
                                </Text>
                            </View>
                            {isAiSpeaking && <VoiceWaveform isSpeaking={isAiSpeaking} />}
                        </View>

                        {/* Phase: question */}
                        {breakpointPhase === 'question' && (
                            <>
                                <Text style={[styles.breakpointContent, { color: colors.text }]}>
                                    {currentBreakpoint.content}
                                </Text>

                                {currentBreakpoint.options ? (
                                    <View style={styles.optionsContainer}>
                                        {currentBreakpoint.options.map((option: string, i: number) => (
                                            <TouchableOpacity
                                                key={i}
                                                style={[
                                                    styles.optionButton,
                                                    {
                                                        borderColor: selectedOption === option ? colors.primary : colors.border,
                                                        backgroundColor: selectedOption === option ? colors.primary + '15' : 'transparent',
                                                    },
                                                ]}
                                                onPress={() => {
                                                    setSelectedOption(option);
                                                    handleAnswer(option);
                                                }}
                                                disabled={isEvaluating}
                                            >
                                                <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ) : (
                                    <View style={styles.voiceSection}>
                                        <VoiceInterface
                                            isActive={showBreakpoint}
                                            onSpeechResult={(text) => {
                                                if (isAskingManual) {
                                                    handleManualQuestion(text);
                                                } else {
                                                    handleAnswer(text);
                                                }
                                            }}
                                        />
                                        <TouchableOpacity
                                            style={[styles.continueButton, { backgroundColor: colors.textMuted }]}
                                            onPress={() => handleAnswer()}
                                        >
                                            <Text style={styles.continueButtonText}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {isEvaluating && (
                                    <View style={styles.evaluatingRow}>
                                        <ActivityIndicator size="small" color={colors.primary} />
                                        <Text style={[styles.evaluatingText, { color: colors.textSecondary }]}>
                                            Checking your answer…
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}

                        {/* Phase: correct feedback */}
                        {breakpointPhase === 'feedback_correct' && (
                            <>
                                <View style={[styles.feedbackBanner, { backgroundColor: colors.success + '18' }]}>
                                    <Feather name="check-circle" size={22} color={colors.success} />
                                    <Text style={[styles.feedbackBannerText, { color: colors.success }]}>
                                        Correct! Well done.
                                    </Text>
                                </View>
                                <Text style={[styles.aiFeedbackText, { color: colors.textSecondary }]}>
                                    {aiFeedback}
                                </Text>
                                <TouchableOpacity
                                    style={[styles.continueButton, { backgroundColor: colors.primary }]}
                                    onPress={handleContinue}
                                >
                                    <Feather name="play" size={16} color="#fff" />
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Phase: wrong — re-explain + retry */}
                        {breakpointPhase === 'feedback_retry' && (
                            <>
                                <View style={[styles.feedbackBanner, { backgroundColor: '#ef444418' }]}>
                                    <Feather name="x-circle" size={22} color="#ef4444" />
                                    <Text style={[styles.feedbackBannerText, { color: '#ef4444' }]}>
                                        Not quite — let's revisit this.
                                    </Text>
                                </View>
                                <ScrollView style={styles.retryScroll} showsVerticalScrollIndicator={false}>
                                    <Text style={[styles.aiFeedbackText, { color: colors.text }]}>
                                        {aiFeedback}
                                    </Text>
                                </ScrollView>
                                {isAiSpeaking && (
                                    <View style={styles.waveContainer}>
                                        <VoiceWaveform isSpeaking={isAiSpeaking} />
                                    </View>
                                )}
                                <View style={styles.retryActions}>
                                    <TouchableOpacity
                                        style={[styles.retryButton, { borderColor: colors.primary }]}
                                        onPress={handleRetry}
                                    >
                                        <Feather name="refresh-cw" size={15} color={colors.primary} />
                                        <Text style={[styles.retryButtonText, { color: colors.primary }]}>Try Again</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.continueButton, { backgroundColor: colors.textMuted, flex: 1 }]}
                                        onPress={handleContinue}
                                    >
                                        <Text style={styles.continueButtonText}>Skip Ahead</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Video
    videoContainer: {
        flex: 1,
        backgroundColor: '#000',
        position: 'relative',
    },
    webview: { flex: 1, backgroundColor: '#000' },
    videoLoadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        gap: 12,
    },
    videoLoadingText: { color: '#aaa', fontSize: 14 },
    noVideoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 32,
    },
    noVideoText: { color: '#888', fontSize: 13, textAlign: 'center' },
    lessonTitleText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
    closeButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    // Info bar
    infoBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 12,
    },
    lessonLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
    lessonName: { fontSize: 15, fontWeight: '700', marginTop: 1 },
    timeText: { fontSize: 12, fontFamily: 'monospace' },
    infoSummary: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    askButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    askButtonText: { fontSize: 13, fontWeight: '600' },

    // Breakpoint overlay
    breakpointOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        paddingHorizontal: 16,
    },
    breakpointCard: {
        width: '100%',
        maxHeight: '80%',
        padding: 20,
        borderRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
    },
    breakpointHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    breakpointBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 5,
    },
    breakpointBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
    breakpointContent: { fontSize: 18, fontWeight: '600', lineHeight: 26, marginBottom: 18 },

    // Options
    optionsContainer: { gap: 10 },
    optionButton: {
        padding: 14,
        borderWidth: 2,
        borderRadius: 10,
    },
    optionText: { fontSize: 15 },

    // Voice
    voiceSection: { alignItems: 'center', gap: 12 },

    // Evaluating
    evaluatingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
    evaluatingText: { fontSize: 14 },

    // Feedback banners
    feedbackBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        borderRadius: 10,
        marginBottom: 14,
    },
    feedbackBannerText: { fontSize: 15, fontWeight: '700' },
    aiFeedbackText: { fontSize: 15, lineHeight: 22, marginBottom: 18 },

    // Retry
    retryScroll: { maxHeight: 120, marginBottom: 14 },
    waveContainer: { marginBottom: 12 },
    retryActions: { flexDirection: 'row', gap: 10 },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 2,
    },
    retryButtonText: { fontSize: 14, fontWeight: '600' },

    // Continue
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 10,
        gap: 6,
    },
    continueButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});

export default CoursePlayerScreen;
