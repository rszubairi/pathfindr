import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { NotificationModal } from '../components/NotificationModal';
import { useTheme, ThemeColors } from '../theme';
import { Skeleton } from '../components/loading/Skeleton';

export function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isNotifVisible, setIsNotifVisible] = React.useState(false);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const notifications = useQuery(
    api.notifications.getScholarshipNotifications,
    user?.id ? { userId: user.id as Id<'users'> } : 'skip'
  );

  const unreadCount = notifications ? notifications.filter(n => !n.notified).length : 0;

  const userEnrollments = useQuery(
    api.enrollments.getUserEnrollments,
    user?.id ? { userId: user.id as Id<'users'> } : 'skip'
  );

  const popularCourses = useQuery(api.courses.getPopularCourses);
  const recentLearners = useQuery(api.analytics.getRecentLearners, { limit: 12 });

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const getCountryEmoji = (countryCode: string) => {
    if (!countryCode) return '';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{t('mobile.dashboard.welcome')}</Text>
          <Text style={styles.subtitle}>{user?.fullName || 'Student'}!</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => setIsNotifVisible(true)}
          >
            <Feather name="bell" size={24} color={colors.text} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          {user?.profileImageUrl ? (
            <Image
              source={{ uri: user.profileImageUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.initialsAvatar}>
              <Text style={styles.initialsText}>{initials}</Text>
            </View>
          )}
        </View>
      </View>

      <NotificationModal
        visible={isNotifVisible}
        onClose={() => setIsNotifVisible(false)}
        userId={user?.id || ''}
        navigation={navigation}
      />

      {/* ── Continue Learning ────────────────────────────────────────────── */}
      <View style={styles.learningSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('learning.dashboard.continueLearning')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>{t('learning.dashboard.seeAll')}</Text>
          </TouchableOpacity>
        </View>

        {userEnrollments === undefined ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.learningList}>
            {[1, 2].map((i) => (
              <View key={i} style={[styles.learningCardSkeleton, { backgroundColor: colors.surface }]}>
                <Skeleton width={120} height={80} borderRadius={12} />
                <View style={{ marginTop: 10 }}>
                  <Skeleton width={100} height={14} />
                  <Skeleton width={60} height={10} style={{ marginTop: 6 }} />
                </View>
              </View>
            ))}
          </ScrollView>
        ) : userEnrollments.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.learningList}>
            {userEnrollments.map((enr) => (
              <TouchableOpacity
                key={enr._id}
                style={[styles.learningCard, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('CoursePlayer', {
                  courseId: enr.courseId,
                  enrollmentId: enr._id,
                  kidProfileId: enr.kidProfileId,
                  lessonIndex: enr.currentLessonIndex
                })}
              >
                <Image
                  source={{ uri: enr.courseThumbnail || 'https://via.placeholder.com/150' }}
                  style={styles.learningThumb}
                  contentFit="cover"
                  transition={300}
                />
                <View style={styles.learningInfo}>
                  <Text style={[styles.learningKid, { color: colors.primary }]}>{enr.kidName}{t('learning.dashboard.progress')}</Text>
                  <Text style={[styles.learningTitle, { color: colors.text }]} numberOfLines={1}>{enr.courseTitle}</Text>
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBarBackground, { backgroundColor: colors.borderLight }]}>
                      <View style={[styles.progressBar, { width: `${enr.progress}%`, backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                      {enr.progress}% • {enr.completedLessons.length}/{enr.totalLessons} {t('learning.dashboard.lessons')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <TouchableOpacity
            style={[styles.emptyLearning, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('Courses')}
          >
            <Feather name="plus-circle" size={32} color={colors.primary} />
            <Text style={[styles.emptyLearningText, { color: colors.textSecondary }]}>
              Start your first course to see progress here!
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Scholarship App Advert ──────────────────────────────────────── */}
      <View style={styles.advertSection}>
        <View style={styles.advertCard}>
          <View style={styles.advertContent}>
            <View style={styles.advertIconContainer}>
              <Feather name="award" size={32} color="#fff" />
            </View>
            <View style={styles.advertTextContainer}>
              <Text style={styles.advertTitle}>PathFindr Scholarships</Text>
              <Text style={styles.advertDesc}>Search & apply for 10,000+ scholarships worldwide. Free for students!</Text>
            </View>
          </View>
          
          <View style={styles.storeButtons}>
            <TouchableOpacity 
              style={[styles.storeBtn, { backgroundColor: '#000' }]}
              onPress={() => { /* Open iOS App Store URL */ }}
            >
              <Feather name="smartphone" size={18} color="#fff" />
              <Text style={styles.storeBtnText}>App Store</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.storeBtn, { backgroundColor: '#3DDC84' }]}
              onPress={() => { /* Open Play Store URL */ }}
            >
              <Feather name="play" size={18} color="#fff" />
              <Text style={styles.storeBtnText}>Play Store</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Community Section ───────────────────────────────────────────── */}
      <View style={styles.communitySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('learning.dashboard.meetCommunity')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>{t('learning.dashboard.viewRankings')}</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.communityList}>
          {recentLearners === undefined ? (
            [1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={styles.communitySkeleton}>
                <Skeleton width={60} height={60} borderRadius={30} />
                <Skeleton width={50} height={10} style={{ marginTop: 8 }} />
              </View>
            ))
          ) : (
            recentLearners.map((learner) => (
              <TouchableOpacity 
                key={learner.id} 
                style={styles.communityCard}
                onPress={() => navigation.navigate('Leaderboard')}
              >
                <View style={styles.communityAvatarWrap}>
                  {learner.avatarUrl ? (
                    <Image source={{ uri: learner.avatarUrl }} style={styles.communityAvatar} />
                  ) : (
                    <View style={[styles.communityInitials, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.communityInitialsText, { color: colors.primary }]}>
                        {learner.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  {learner.countryCode && (
                    <View style={styles.communityFlagWrap}>
                      <Text style={styles.communityFlag}>{getCountryEmoji(learner.countryCode)}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.communityName, { color: colors.text }]} numberOfLines={1}>
                  {learner.name.split(' ')[0]}
                </Text>
                <Text style={[styles.communityStat, { color: colors.textSecondary }]}>
                  {learner.enrollmentCount} {t('learning.dashboard.topics')}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* ── Popular Courses ────────────────────────────────────────────── */}
      <View style={styles.popularSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('learning.dashboard.popularCourses')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>{t('learning.dashboard.seeAll')}</Text>
          </TouchableOpacity>
        </View>

        {popularCourses === undefined ? (
          <View style={styles.popularGrid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.popularCardSkeleton}>
                <Skeleton width="100%" height={100} borderRadius={12} />
                <Skeleton width="80%" height={12} style={{ marginTop: 8 }} />
                <Skeleton width="50%" height={10} style={{ marginTop: 4 }} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.popularGrid}>
            {popularCourses.map((course) => (
              <TouchableOpacity 
                key={course._id} 
                style={[styles.popularCard, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('CourseDetail', { courseId: course._id })}
              >
                <Image 
                  source={{ uri: course.thumbnailUrl || 'https://via.placeholder.com/150' }} 
                  style={styles.popularThumb} 
                  contentFit="cover"
                />
                <View style={styles.popularInfo}>
                  <Text style={[styles.popularTitle, { color: colors.text }]} numberOfLines={2}>
                    {course.title}
                  </Text>
                  <Text style={[styles.popularMeta, { color: colors.textSecondary }]}>
                    {course.duration}m • {course.difficulty}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bellBtn: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    color: colors.textMuted,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.border,
  },
  initialsAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  initialsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  learningSection: {
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  learningList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  learningCard: {
    width: 260,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  learningCardSkeleton: {
    width: 260,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  learningThumb: {
    width: '100%',
    height: 130,
  },
  learningInfo: {
    padding: 16,
  },
  learningKid: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
  },
  progressText: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  emptyLearning: {
    marginHorizontal: 24,
    padding: 32,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyLearningText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  advertSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  advertCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 24,
  },
  advertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  advertIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advertTextContainer: {
    flex: 1,
  },
  advertTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  advertDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  storeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  storeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  storeBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  communitySection: {
    marginBottom: 32,
  },
  communityList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  communityCard: {
    alignItems: 'center',
    width: 80,
  },
  communityAvatarWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  communityAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary + '20',
  },
  communityInitials: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '10',
  },
  communityInitialsText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  communityFlagWrap: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  communityFlag: {
    fontSize: 14,
  },
  communityName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  communityStat: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  communitySkeleton: {
    alignItems: 'center',
    gap: 8,
  },
  popularSection: {
    paddingBottom: 40,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 16,
    justifyContent: 'space-between',
  },
  popularCard: {
    width: '47%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  popularCardSkeleton: {
    width: '47%',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  popularThumb: {
    width: '100%',
    height: 110,
  },
  popularInfo: {
    padding: 12,
  },
  popularTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    height: 34,
  },
  popularMeta: {
    fontSize: 10,
    fontWeight: '500',
  },
});
