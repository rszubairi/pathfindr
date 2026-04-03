import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Image } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useTheme } from '../../theme';
import { Feather } from '@expo/vector-icons';

export function LeaderboardScreen() {
    const { colors } = useTheme();
    
    // Get top lessons/courses to show leaderboards for
    const topCourse = useQuery(api.courses.getCourses, {});
    const selectedCourseId = topCourse && topCourse.length > 0 ? topCourse[0]._id : null;

    const leaderboardData = useQuery(api.leaderboard.getLeaderboard, 
        selectedCourseId ? { courseId: selectedCourseId } : 'skip'
    );

    const renderLeaderboardItem = ({ item, index }: { item: any; index: number }) => (
        <View style={[styles.leaderboardCard, { backgroundColor: colors.surface }]}>
            <View style={styles.rankContainer}>
                {index < 3 ? (
                    <Feather 
                        name="award" 
                        size={28} 
                        color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'} 
                    />
                ) : (
                    <Text style={[styles.rankText, { color: colors.textSecondary }]}>{index + 1}</Text>
                )}
            </View>
            
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
                {item.avatarUrl ? (
                    <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                ) : (
                    <Feather name="user" size={24} color={colors.primary} />
                )}
            </View>

            <View style={styles.playerInfo}>
                <Text style={[styles.playerName, { color: colors.text }]}>{item.kidName || 'A Student'}</Text>
                <Text style={[styles.playerStats, { color: colors.textSecondary }]}>
                    {item.completedAssessments || 0} quizzes done
                </Text>
            </View>

            <View style={styles.scoreContainer}>
                <Text style={[styles.scoreText, { color: colors.primary }]}>{item.totalScore || 0}</Text>
                <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>pts</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Top Learners</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Rankings based on assessment scores
                </Text>
            </View>

            <FlatList
                data={leaderboardData}
                renderItem={renderLeaderboardItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Feather name="award" size={48} color={colors.textMuted} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Leaderboard is getting ready! Check back later.
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
    leaderboardCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    rankText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    playerStats: {
        fontSize: 12,
        marginTop: 2,
    },
    scoreContainer: {
        alignItems: 'flex-end',
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scoreLabel: {
        fontSize: 10,
        marginTop: -2,
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

export default LeaderboardScreen;
