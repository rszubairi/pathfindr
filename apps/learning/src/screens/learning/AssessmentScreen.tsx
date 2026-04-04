import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { Skeleton } from '../../components/loading/Skeleton';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type AssessmentRouteProp = RouteProp<RootStackParamList, 'Assessment'>;

export function AssessmentScreen() {
    const route = useRoute<AssessmentRouteProp>();
    const navigation = useNavigation();
    const { colors } = useTheme();
    const { assessmentId, courseId, enrollmentId } = route.params;

    const assessment = useQuery(api.assessments.getAssessmentByCourse, { courseId: courseId as Id<'courses'> });
    const submit = useMutation(api.assessments.submitAssessment);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnswer = (questionId: string, answer: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = async () => {
        if (!assessment || isSubmitting) return;

        setIsSubmitting(true);
        let score = 0;
        const totalPoints = assessment.questions.reduce((acc: number, q: any) => acc + q.points, 0);

        const results = assessment.questions.map((q: any) => {
            const isCorrect = answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
            if (isCorrect) score += q.points;
            return {
                questionId: q.id,
                answer: answers[q.id] || '',
                isCorrect,
                pointsEarned: isCorrect ? q.points : 0,
            };
        });

        const percentage = Math.round((score / totalPoints) * 100);
        const passed = percentage >= assessment.passingScore;

        try {
            await submit({
                assessmentId: assessment._id,
                kidProfileId: route.params.kidProfileId as any,
                answers: results,
                score,
                totalPoints,
                percentage,
                passed,
            });
            Haptics.notificationAsync(passed ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
            setShowResults(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!assessment) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <Skeleton width="60%" height={24} style={{ marginBottom: 16 }} />
                    <Skeleton width="100%" height={4} />
                    <Skeleton width="40%" height={14} style={{ alignSelf: 'center', marginTop: 8 }} />
                </View>
                <View style={styles.scrollContent}>
                    <View style={[styles.questionCard, { backgroundColor: colors.surface }]}>
                        <Skeleton width="90%" height={20} style={{ marginBottom: 12 }} />
                        <Skeleton width="70%" height={20} style={{ marginBottom: 24 }} />
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} width="100%" height={56} borderRadius={8} style={{ marginBottom: 12 }} />
                        ))}
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    const currentQuestion = assessment.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

    if (showResults) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.resultsCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.resultsTitle, { color: colors.text }]}>Assessment Complete!</Text>
                    <Text style={[styles.score, { color: colors.primary }]}>
                        {Math.round((Object.keys(answers).length / assessment.questions.length) * 100)}%
                    </Text>
                    <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
                        You answered {Object.keys(answers).length} out of {assessment.questions.length} questions.
                    </Text>
                    <TouchableOpacity
                        style={[styles.doneButton, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <Text style={[styles.title, { color: colors.text }]}>{assessment.title}</Text>
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: colors.border }]} />
                    <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    Question {currentQuestionIndex + 1} of {assessment.questions.length}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.questionCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.questionText, { color: colors.text }]}>
                        {currentQuestion.question}
                    </Text>

                    <View style={styles.optionsContainer}>
                        {currentQuestion.options?.map((option: string, index: number) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionButton,
                                    { borderColor: colors.border },
                                    answers[currentQuestion.id] === option && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
                                ]}
                                onPress={() => handleAnswer(currentQuestion.id, option)}
                            >
                                <Text style={[styles.optionText, { color: colors.text }]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.surface }]}>
                {currentQuestionIndex > 0 && (
                    <TouchableOpacity
                        style={[styles.navButton, { borderColor: colors.border }]}
                        onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    >
                        <Text style={[styles.navButtonText, { color: colors.text }]}>Previous</Text>
                    </TouchableOpacity>
                )}

                {currentQuestionIndex < assessment.questions.length - 1 ? (
                    <TouchableOpacity
                        style={[styles.navButton, { backgroundColor: colors.primary }]}
                        onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    >
                        <Text style={[styles.navButtonText, { color: '#ffffff' }]}>Next</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: colors.primary }]}
                        onPress={handleSubmit}
                    >
                        <Text style={[styles.submitButtonText, { color: '#ffffff' }]}>Submit</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    progressContainer: {
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        ...StyleSheet.absoluteFillObject,
    },
    progressFill: {
        height: '100%',
    },
    progressText: {
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
    },
    scrollContent: {
        padding: 16,
    },
    questionCard: {
        padding: 20,
        borderRadius: 12,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    navButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    resultsCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        margin: 16,
        borderRadius: 16,
    },
    resultsTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    score: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    resultsText: {
        fontSize: 16,
        marginBottom: 32,
        textAlign: 'center',
    },
    doneButton: {
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 8,
    },
    doneButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AssessmentScreen;