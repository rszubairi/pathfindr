import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useTheme } from '../../theme';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Feather } from '@expo/vector-icons';

type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;

export function CourseDetailScreen() {
    const route = useRoute<CourseDetailRouteProp>();
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    const { selectedProfile } = useSelector((state: RootState) => state.kidProfiles);
    const { user } = useSelector((state: RootState) => state.auth);
    const { courseId } = route.params;

    const course = useQuery(api.courses.getCourseById, { courseId: courseId as Id<'courses'> });
    const enroll = useMutation(api.enrollments.enrollInCourse);
    const existingEnrollment = useQuery(api.enrollments.getEnrollment, 
        selectedProfile ? { courseId: courseId as Id<'courses'>, kidProfileId: (selectedProfile as any)._id } : 'skip'
    );

    const [isEnrolling, setIsEnrolling] = useState(false);

    const handleEnroll = async () => {
        if (!selectedProfile) {
            Alert.alert('No Profile Selected', 'Please select a kid profile from the Kids tab before starting a course.');
            return;
        }
        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to enroll.');
            return;
        }

        setIsEnrolling(true);
        try {
            const enrollmentId = await enroll({
                userId: user.id as Id<'users'>,
                courseId: courseId as Id<'courses'>,
                kidProfileId: (selectedProfile as any)._id,
            });

            navigation.navigate('CoursePlayer', {
                courseId,
                enrollmentId,
            });
        } catch (error: any) {
            const raw: string = error.message || '';
            const extracted = raw.includes('Uncaught Error:')
                ? raw.split('Uncaught Error:').pop()?.trim()
                : raw;
            Alert.alert('Error', extracted || 'Failed to enroll in course. Please try again.');
        } finally {
            setIsEnrolling(false);
        }
    };

    if (!course) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Image 
                source={{ uri: course.thumbnailUrl || 'https://via.placeholder.com/300' }} 
                style={styles.heroImage} 
            />
            
            <View style={[styles.content, { backgroundColor: colors.background }]}>
                <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>
                
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Feather name="clock" size={16} color={colors.textSecondary} />
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>{course.duration} mins</Text>
                    </View>
                    <View style={styles.stat}>
                        <Feather name="bar-chart" size={16} color={colors.textSecondary} />
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>{course.difficulty}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Feather name="users" size={16} color={colors.textSecondary} />
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>Ages {course.ageRange.min}-{course.ageRange.max}</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>About this course</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {course.description}
                </Text>

                <View style={styles.objectivesContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>What you'll learn</Text>
                    {course.learningObjectives.map((obj: string, index: number) => (
                        <View key={index} style={styles.objectiveRow}>
                            <Feather name="check-circle" size={18} color={colors.success} />
                            <Text style={[styles.objectiveText, { color: colors.textSecondary }]}>{obj}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={[styles.footer, { backgroundColor: colors.surface }]}>
                {selectedProfile ? (
                    <TouchableOpacity 
                        style={[styles.enrollButton, { backgroundColor: colors.primary, opacity: isEnrolling ? 0.7 : 1 }]} 
                        onPress={handleEnroll}
                        disabled={isEnrolling}
                    >
                        {isEnrolling ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.enrollButtonText}>
                                {existingEnrollment ? 'Continue Learning' : 'Start for ' + selectedProfile.name}
                            </Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={[styles.enrollButton, { backgroundColor: colors.textMuted }]} 
                        onPress={() => navigation.navigate('Main', { screen: 'Kids' })}
                    >
                        <Text style={styles.enrollButtonText}>Select a Profile to Start</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heroImage: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 14,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    objectivesContainer: {
        marginBottom: 100,
    },
    objectiveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    objectiveText: {
        fontSize: 15,
        flex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    enrollButton: {
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    enrollButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CourseDetailScreen;