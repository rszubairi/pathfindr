import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useTheme } from '../../theme';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Feather } from '@expo/vector-icons';
import { Skeleton } from '../../components/loading/Skeleton';
import * as Haptics from 'expo-haptics';

type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;

export function CourseDetailScreen() {
    const route = useRoute<CourseDetailRouteProp>();
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    const { selectedProfile } = useSelector((state: RootState) => state.kidProfiles);
    const { user } = useSelector((state: RootState) => state.auth);
    const { courseId } = route.params;

    const course = useQuery(api.courses.getCourseById, { courseId: courseId as Id<'courses'> });
    const lessons = useQuery(api.courses.getCourseLessons, { courseId: courseId as Id<'courses'> });
    const enroll = useMutation(api.enrollments.enrollInCourse);
    const existingEnrollment = useQuery(api.enrollments.getEnrollment,
        selectedProfile ? { courseId: courseId as Id<'courses'>, kidProfileId: (selectedProfile as any)._id } : 'skip'
    );

    const [isEnrolling, setIsEnrolling] = useState(false);

    // Auto-enroll when returning from KidProfileSelect with a profile now selected
    useEffect(() => {
        if (route.params?.autoEnroll && selectedProfile && user?.id) {
            handleEnroll();
        }
    }, [route.params?.autoEnroll, selectedProfile]);

    const handleEnroll = async () => {
        if (!selectedProfile) {
            navigation.navigate('KidProfileSelect', { courseId });
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

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.navigate('CoursePlayer', {
                courseId,
                enrollmentId,
                kidProfileId: (selectedProfile as any)._id,
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

    const handleOpenLesson = async (lessonIndex: number) => {
        if (!selectedProfile) {
            navigation.navigate('KidProfileSelect', { courseId });
            return;
        }
        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in.');
            return;
        }
        setIsEnrolling(true);
        try {
            const enrollmentId = existingEnrollment
                ? existingEnrollment._id
                : await enroll({
                      userId: user.id as Id<'users'>,
                      courseId: courseId as Id<'courses'>,
                      kidProfileId: (selectedProfile as any)._id,
                  });
            navigation.navigate('CoursePlayer', {
                courseId,
                enrollmentId: enrollmentId as string,
                kidProfileId: (selectedProfile as any)._id,
                lessonIndex,
            });
        } catch (error: any) {
            const raw: string = error.message || '';
            const extracted = raw.includes('Uncaught Error:') ? raw.split('Uncaught Error:').pop()?.trim() : raw;
            Alert.alert('Error', extracted || 'Failed to open lesson.');
        } finally {
            setIsEnrolling(false);
        }
    };

    if (!course) {
        return (
            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
                <Skeleton width="100%" height={250} borderRadius={0} />
                <View style={styles.content}>
                    <Skeleton width="80%" height={32} style={{ marginBottom: 12 }} />
                    <View style={styles.statsRow}>
                        <Skeleton width={100} height={20} />
                        <Skeleton width={80} height={20} />
                        <Skeleton width={120} height={20} />
                    </View>
                    <Skeleton width="40%" height={24} style={{ marginTop: 12, marginBottom: 12 }} />
                    <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
                    <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
                    <Skeleton width="90%" height={16} style={{ marginBottom: 24 }} />
                    <Skeleton width="100%" height={240} borderRadius={16} />
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Image 
                source={{ uri: course.thumbnailUrl || 'https://via.placeholder.com/300' }} 
                style={styles.heroImage} 
                contentFit="cover"
                transition={500}
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

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Lessons</Text>
                {!lessons ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
                ) : lessons.length === 0 ? (
                    <Text style={[styles.description, { color: colors.textSecondary }]}>No lessons available yet.</Text>
                ) : (
                    lessons.map((lesson: any, index: number) => (
                        <TouchableOpacity
                            key={lesson._id}
                            style={[styles.lessonRow, { backgroundColor: colors.surface }]}
                            onPress={() => handleOpenLesson(index)}
                            disabled={isEnrolling}
                        >
                            <View style={[styles.lessonIndex, { backgroundColor: colors.primary + '18' }]}>
                                <Text style={[styles.lessonIndexText, { color: colors.primary }]}>{index + 1}</Text>
                            </View>
                            <View style={styles.lessonInfo}>
                                <Text style={[styles.lessonTitle, { color: colors.text }]}>{lesson.title}</Text>
                                <View style={styles.lessonMeta}>
                                    <Feather name="clock" size={12} color={colors.textMuted} />
                                    <Text style={[styles.lessonMetaText, { color: colors.textMuted }]}>
                                        {lesson.duration} min
                                    </Text>
                                    {lesson.breakpoints?.length > 0 && (
                                        <>
                                            <Feather name="zap" size={12} color={colors.textMuted} style={{ marginLeft: 8 }} />
                                            <Text style={[styles.lessonMetaText, { color: colors.textMuted }]}>
                                                {lesson.breakpoints.length} interrupt{lesson.breakpoints.length !== 1 ? 's' : ''}
                                            </Text>
                                        </>
                                    )}
                                </View>
                            </View>
                            <Feather name="play-circle" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    ))
                )}
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
        marginBottom: 24,
    },
    lessonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        gap: 12,
    },
    lessonIndex: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lessonIndexText: {
        fontSize: 14,
        fontWeight: '700',
    },
    lessonInfo: {
        flex: 1,
        gap: 4,
    },
    lessonTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    lessonMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    lessonMetaText: {
        fontSize: 12,
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