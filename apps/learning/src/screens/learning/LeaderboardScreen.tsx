import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useTheme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

export function LeaderboardScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { user } = useSelector((state: RootState) => state.auth);
    const { selectedProfile } = useSelector((state: RootState) => state.kidProfiles);
    const [activeTab, setActiveTab] = React.useState<'global' | 'country'>('global');

    // Get kid's specific rankings
    const myRankings = useQuery(
        api.leaderboard.getKidRankings,
        user?.id && selectedProfile ? { userId: user.id as any, kidProfileId: (selectedProfile as any)._id } : 'skip'
    );

    // Get leaderboard data
    const leaderboardData = useQuery(
        api.leaderboard.getLeaderboard,
        activeTab === 'country' && myRankings?.countryCode 
            ? { countryCode: myRankings.countryCode } 
            : {}
    );

    const getRankIcon = (index: number) => {
        if (index === 0) return { name: 'trophy', color: '#FFD700', size: 28 };
        if (index === 1) return { name: 'award', color: '#C0C0C0', size: 26 };
        if (index === 2) return { name: 'award', color: '#CD7F32', size: 24 };
        return null;
    };

    const renderLeaderboardItem = ({ item, index }: { item: any; index: number }) => {
        const isMe = (selectedProfile as any)?._id === item.kidProfileId;
        const icon = getRankIcon(index);

        return (
            <View style={[
                styles.leaderboardCard, 
                { backgroundColor: colors.surface },
                isMe && { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primary + '05' }
            ]}>
                <View style={styles.rankContainer}>
                    {icon ? (
                        <Feather name={icon.name as any} size={icon.size} color={icon.color} />
                    ) : (
                        <Text style={[styles.rankText, { color: colors.textSecondary }]}>{index + 1}</Text>
                    )}
                </View>
                
                <View style={styles.avatarWrapper}>
                    {item.avatarUrl ? (
                        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.initialsAvatar, { backgroundColor: colors.primary + '20' }]}>
                            <Text style={[styles.initialsText, { color: colors.primary }]}>
                                {item.kidName?.charAt(0) || '?'}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.playerInfo}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>
                            {item.kidName || 'A Student'} {isMe && `(${t('learning.leaderboard.you')})`}
                        </Text>
                        {item.countryCode && (
                            <Text style={styles.countryFlag}>
                                {getCountryEmoji(item.countryCode)}
                            </Text>
                        )}
                    </View>
                    <Text style={[styles.playerStats, { color: colors.textSecondary }]}>
                        {item.streak || 0} {t('learning.leaderboard.dayStreak')} • {item.completedAssessments || 0} {t('learning.leaderboard.quizzes')}
                    </Text>
                </View>

                <View style={styles.scoreContainer}>
                    <Text style={[styles.scoreText, { color: colors.primary }]}>{item.totalScore?.toLocaleString() || 0}</Text>
                    <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>XP</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>{t('learning.leaderboard.title')}</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {activeTab === 'global' ? t('learning.leaderboard.competingGlobally') : t('learning.leaderboard.topInCountry', { country: myRankings?.countryCode || 'your country' })}
                    </Text>
                </View>
                {selectedProfile && (
                    <View style={[styles.myRankBadge, { backgroundColor: colors.primary + '15' }]}>
                        <View style={styles.rankBadgeItem}>
                            <Text style={[styles.rankBadgeLabel, { color: colors.textSecondary }]}>{t('learning.leaderboard.globalRank')}</Text>
                            <Text style={[styles.rankBadgeValue, { color: colors.primary }]}>#{myRankings?.globalRank || '...'}</Text>
                        </View>
                        <View style={[styles.vDivider, { backgroundColor: colors.primary + '30' }]} />
                        <View style={styles.rankBadgeItem}>
                            <Text style={[styles.rankBadgeLabel, { color: colors.textSecondary }]}>{t('learning.leaderboard.countryRank')}</Text>
                            <Text style={[styles.rankBadgeValue, { color: colors.primary }]}>#{myRankings?.countryRank || '...'}</Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'global' && { backgroundColor: colors.primary }]}
                    onPress={() => setActiveTab('global')}
                >
                    <Text style={[styles.tabText, activeTab === 'global' ? { color: '#fff' } : { color: colors.textSecondary }]}>{t('learning.leaderboard.global')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'country' && { backgroundColor: colors.primary }]}
                    onPress={() => setActiveTab('country')}
                >
                    <Text style={[styles.tabText, activeTab === 'country' ? { color: '#fff' } : { color: colors.textSecondary }]}>{t('learning.leaderboard.country')}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={leaderboardData}
                renderItem={renderLeaderboardItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    leaderboardData === undefined ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Feather name="award" size={48} color={colors.textMuted} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                {t('learning.leaderboard.noRankings')}
                            </Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
}

function getCountryEmoji(countryCode: string) {
    if (!countryCode) return '';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    myRankBadge: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
    },
    rankBadgeItem: {
        alignItems: 'center',
    },
    rankBadgeLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    rankBadgeValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    vDivider: {
        width: 1,
        height: 20,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    leaderboardCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 20,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4,
    },
    rankText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    avatarWrapper: {
        width: 48,
        height: 48,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 12,
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    playerInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    playerName: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    countryFlag: {
        fontSize: 14,
    },
    playerStats: {
        fontSize: 11,
        marginTop: 2,
    },
    scoreContainer: {
        alignItems: 'flex-end',
        minWidth: 50,
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '800',
    },
    scoreLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: -2,
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
    },
});

export default LeaderboardScreen;
