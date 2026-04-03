import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useTheme } from '../../theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Feather } from '@expo/vector-icons';

export function ProgressScreen() {
    const { colors } = useTheme();
    const { selectedProfile } = useSelector((state: RootState) => state.kidProfiles);
    
    // Get enrollments for the selected kid
    const enrollments = useQuery(api.enrollments.getKidEnrollments, 
        selectedProfile ? { kidProfileId: (selectedProfile as any)._id } : 'skip'
    );

    const renderProgressItem = ({ item }: { item: any }) => (
        <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                    <Feather name="book" size={24} color={colors.primary} />
                </View>
                <View style={styles.cardHeaderText}>
                    <Text style={[styles.courseTitle, { color: colors.text }]}>{item.courseTitle || 'Course'}</Text>
                    <Text style={[styles.lastAccessed, { color: colors.textSecondary }]}>
                        Last active: {new Date(item.lastAccessedAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Total Progress</Text>
                    <Text style={[styles.progressPercentage, { color: colors.primary }]}>{item.progress}%</Text>
                </View>
                <View style={[styles.progressBarBackground, { backgroundColor: colors.borderLight }]}>
                    <View 
                        style={[
                            styles.progressBarFill, 
                            { 
                                backgroundColor: colors.primary, 
                                width: `${item.progress}%` 
                            }
                        ]} 
                    />
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{item.completedLessons.length}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Lessons Done</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{item.totalScore || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points Earned</Text>
                </View>
            </View>
        </View>
    );

    if (!selectedProfile) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Feather name="users" size={64} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Please select a kid profile to see progress!
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Learning Progress</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Tracking for {selectedProfile.name}
                </Text>
            </View>

            <FlatList
                data={enrollments}
                renderItem={renderProgressItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Feather name="layout" size={48} color={colors.textMuted} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            No enrollments found. Start learning a course!
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
    },
    listContent: {
        padding: 16,
    },
    progressCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardHeaderText: {
        flex: 1,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lastAccessed: {
        fontSize: 12,
        marginTop: 2,
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressPercentage: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressBarBackground: {
        height: 8,
        borderRadius: 4,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ProgressScreen;
