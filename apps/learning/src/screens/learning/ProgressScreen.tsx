import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useTheme } from '../../theme';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { setSelectedProfile } from '../../store/slices/kidProfilesSlice';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export function ProgressScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { user } = useSelector((state: RootState) => state.auth);
    const { profiles } = useSelector((state: RootState) => state.kidProfiles);
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();

    // Get aggregate statistics for all kids
    const multiKidProgress = useQuery(
        api.analytics.getUserKidsProgress,
        user?.id ? { userId: user.id as any } : 'skip'
    );

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    const handleSelectKid = (kidId: string) => {
        const profile = profiles.find(p => (p as any)._id === kidId || p.id === kidId);
        if (profile) {
            dispatch(setSelectedProfile(profile));
            // Navigate to or stay on appropriate screen? We stay here for now or maybe just update selected profile
        }
    };

    const renderKidProgressItem = ({ item }: { item: any }) => (
        <View style={[styles.kidCard, { backgroundColor: colors.surface }]}>
            <View style={styles.cardTop}>
                <View style={styles.avatarContainer}>
                    {item.avatarUrl ? (
                        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.initialsAvatar, { backgroundColor: colors.primary + '20' }]}>
                            <Text style={[styles.initialsText, { color: colors.primary }]}>
                                {item.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.kidInfo}>
                    <Text style={[styles.kidName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.lastActive, { color: colors.textSecondary }]}>
                        {t('learning.progress.lastSession')}: {new Date(item.lastActive).toLocaleDateString()}
                    </Text>
                </View>
                <TouchableOpacity 
                    style={[styles.detailsBtn, { borderColor: colors.border }]}
                    onPress={() => handleSelectKid(item.kidId)}
                >
                    <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                    <Text style={[styles.statNum, { color: colors.text }]}>{item.totalCourses}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('common.courses') || 'Courses'}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <Text style={[styles.statNum, { color: colors.text }]}>{item.completedCourses}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('learning.progress.completed')}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <Text style={[styles.statNum, { color: colors.text }]}>{item.totalPoints}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('learning.progress.points')}</Text>
                </View>
            </View>

            <View style={styles.progressRow}>
                <View style={styles.barWrap}>
                    <View style={styles.barInfo}>
                        <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{t('learning.progress.avgProgress')}</Text>
                        <Text style={[styles.barPercentage, { color: colors.primary }]}>{item.averageProgress}%</Text>
                    </View>
                    <View style={[styles.barBg, { backgroundColor: colors.borderLight }]}>
                        <View style={[styles.barFill, { backgroundColor: colors.primary, width: `${item.averageProgress}%` }]} />
                    </View>
                </View>
            </View>

            <View style={styles.timeWrap}>
                <Feather name="clock" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                    {t('learning.progress.timeSpent')}: {formatTime(item.totalTimeSpent || 0)}
                </Text>
                {item.latestCourse && (
                    <>
                        <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
                        <Text style={[styles.currentCourse, { color: colors.textSecondary }]} numberOfLines={1}>
                            {t('learning.progress.active')}: {item.latestCourse}
                        </Text>
                    </>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>{t('learning.progress.title')}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {t('learning.progress.subtitle')}
                </Text>
            </View>

            <FlatList
                data={multiKidProgress}
                renderItem={renderKidProgressItem}
                keyExtractor={(item) => item.kidId}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Feather name="users" size={48} color={colors.textMuted} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            {t('learning.progress.noProfiles')}
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
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 15,
        marginTop: 4,
    },
    listContent: {
        padding: 16,
    },
    kidCard: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 54,
        height: 54,
        borderRadius: 18,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    initialsAvatar: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    kidInfo: {
        flex: 1,
        marginLeft: 16,
    },
    kidName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    lastActive: {
        fontSize: 12,
        marginTop: 2,
    },
    detailsBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 16,
        paddingVertical: 12,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statNum: {
        fontSize: 18,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 11,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        height: '60%',
        backgroundColor: '#e2e8f0',
        alignSelf: 'center',
    },
    progressRow: {
        marginBottom: 16,
    },
    barWrap: {
        width: '100%',
    },
    barInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    barLabel: {
        fontSize: 12,
        fontWeight: '700',
    },
    barPercentage: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    barBg: {
        height: 8,
        borderRadius: 4,
        width: '100%',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
    timeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 12,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        marginHorizontal: 8,
    },
    currentCourse: {
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default ProgressScreen;
