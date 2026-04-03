import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setSelectedCourse, addEnrollment, setCurrentEnrollment } from '../../store/slices/learningSlice';
import { useTheme } from '../../theme';

export function CourseDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { selectedCourse } = useSelector((state: RootState) => state.learning);

    // @ts-ignore - courseId from route params
    const { courseId } = route.params || {};

    const handleEnroll = () => {
        if (selectedCourse) {
            // Create a mock enrollment (will be replaced with actual Convex call)
            const mockEnrollment = {
                id: `enrollment_${Date.now()}`,
                userId: 'user_1',
                kidProfileId: 'kid_1',
                courseId: selectedCourse.id,
                progress: 0,
                currentLessonIndex: 0,
                completedLessons: [],
                enrolledAt: new Date().toISOString(),
            };

            dispatch(addEnrollment(mockEnrollment));
            dispatch(setCurrentEnrollment(mockEnrollment));

            // @ts-ignore - navigate with params
            navigation.navigate('CoursePlayer', {
                courseId: selectedCourse.id,
                enrollmentId: mockEnrollment.id,
            });
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <Text style={[styles.title, { color: colors.text }]}>{selectedCourse?.title || 'Course Details'}</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {selectedCourse?.description || 'No description available'}
                </Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Duration</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{selectedCourse?.duration || 0} minutes</Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Difficulty</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{selectedCourse?.difficulty || 'Beginner'}</Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Age Range</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                    {selectedCourse?.ageRange?.min || 0} - {selectedCourse?.ageRange?.max || 0} years
                </Text>
            </View>

            <TouchableOpacity style={[styles.enrollButton, { backgroundColor: colors.primary }]} onPress={handleEnroll}>
                <Text style={styles.enrollButtonText}>Start Learning</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    infoCard: {
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    infoLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '600',
    },
    enrollButton: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    enrollButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CourseDetailScreen;