import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { RootStackParamList } from '../../navigation/RootNavigator';

type AssessmentRouteProp = RouteProp<RootStackParamList, 'Assessment'>;

export function AssessmentScreen() {
    const route = useRoute<AssessmentRouteProp>();
    const { colors } = useTheme();
    const { assessmentId, courseId, enrollmentId } = route.params;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);

    // Mock assessment data (will be replaced with actual Convex data)
    const mockAssessment = {
        id: assessmentId,
        title: 'Course Assessment',
        questions: [
            {
                id: 'q1',
                question: 'What is the main concept covered in this course?',
                type: 'multiple_choice' as const,
                options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
                correctAnswer: 'Concept A',
                points: 10,
            },
            {
                id: 'q2',
                question: 'True or False: This is an important principle.',
                type: 'true_false' as const,
                options: ['True', 'False'],
                correctAnswer: 'True',
                points: 10,
            },
            {
                id: 'q3',
                question: 'Explain the key takeaway from this lesson.',
                type: 'short_answer' as const,
                correctAnswer: 'sample answer',
                points: 20,
            },
        ],
    };

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = () => {
        // Calculate score (mock)
        let score = 0;
        mockAssessment.questions.forEach((q) => {
            if (answers[q.id] === q.correctAnswer) {
                score += q.points;
            }
        });
        setShowResults(true);
    };

    const currentQuestion = mockAssessment.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / mockAssessment.questions.length) * 100;

    if (showResults) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.resultsCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.resultsTitle, { color: colors.text }]}>Assessment Complete!</Text>
                    <Text style={[styles.score, { color: colors.primary }]}>
                        {Math.round((Object.keys(answers).length / mockAssessment.questions.length) * 100)}%
                    </Text>
                    <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
                        You answered {Object.keys(answers).length} out of {mockAssessment.questions.length} questions.
                    </Text>
                    <TouchableOpacity
                        style={[styles.doneButton, { backgroundColor: colors.primary }]}
                        onPress={() => { /* Navigate back */ }}
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
                <Text style={[styles.title, { color: colors.text }]}>{mockAssessment.title}</Text>
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: colors.border }]} />
                    <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    Question {currentQuestionIndex + 1} of {mockAssessment.questions.length}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.questionCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.questionText, { color: colors.text }]}>
                        {currentQuestion.question}
                    </Text>

                    <View style={styles.optionsContainer}>
                        {currentQuestion.options?.map((option, index) => (
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

                {currentQuestionIndex < mockAssessment.questions.length - 1 ? (
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