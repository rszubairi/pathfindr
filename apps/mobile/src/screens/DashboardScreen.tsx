import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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

  const subscription = useQuery(
    api.subscriptions.getUserSubscription,
    user?.id ? { userId: user.id as Id<'users'> } : 'skip'
  );

  const upcomingScholarships = useQuery(api.scholarships.search, { searchQuery: '' });

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <ScrollView style={styles.container}>
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

      <View style={styles.subscriptionSection}>
        {subscription === undefined ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : subscription ? (
          <View style={styles.activeSubscriptionBox}>
            <View style={styles.subHeader}>
              <Feather name="zap" size={24} color="#eab308" />
              <Text style={styles.subTitle}>
                {t('mobile.dashboard.plan', { tier: subscription.tier.toUpperCase() })}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{subscription.applicationsUsed}</Text>
                <Text style={styles.statLabel}>{t('mobile.dashboard.applied')}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {subscription.applicationsLimit - subscription.applicationsUsed}
                </Text>
                <Text style={styles.statLabel}>{t('mobile.dashboard.available')}</Text>
              </View>
            </View>

            <View style={styles.deadlinesContainer}>
              <Text style={styles.deadlinesTitle}>{t('mobile.dashboard.upcomingDeadlines')}</Text>
              {upcomingScholarships?.slice(0, 3).map((item) => (
                <View key={item._id} style={styles.deadlineRow}>
                  <Text style={styles.deadlineName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.deadlineDate}>{item.deadline || 'Rolling'}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.inactiveSubscriptionBox}>
            <Text style={styles.inactiveTitle}>{t('mobile.dashboard.unlockPotential')}</Text>
            <Text style={styles.inactiveDesc}>
              {t('mobile.dashboard.subscribeDesc')}
            </Text>
            <TouchableOpacity
              style={styles.upgradeBtn}
              onPress={() => navigation.navigate('Subscription')}
            >
              <Text style={styles.upgradeBtnText}>{t('mobile.dashboard.viewPlans')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>{t('mobile.dashboard.exploreOpportunities')}</Text>

        <View style={styles.featuresGrid}>
          <FeatureCard
            title={t('mobile.dashboard.scholarships')}
            description={t('mobile.dashboard.scholarshipsDesc')}
            icon="award"
            onPress={() => navigation.navigate('Scholarships')}
            colors={colors}
          />
          <FeatureCard
            title={t('mobile.dashboard.internships')}
            description={t('mobile.dashboard.internshipsDesc')}
            icon="briefcase"
            onPress={() => navigation.navigate('Internships')}
            colors={colors}
          />
          <FeatureCard
            title={t('mobile.dashboard.boardingSchools')}
            description={t('mobile.dashboard.boardingSchoolsDesc')}
            icon="book-open"
            onPress={() => navigation.navigate('BoardingSchools')}
            colors={colors}
          />
          <FeatureCard
            title={t('mobile.dashboard.internationalSchools')}
            description={t('mobile.dashboard.internationalSchoolsDesc')}
            icon="globe"
            onPress={() => navigation.navigate('InternationalSchools')}
            colors={colors}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  onPress,
  colors,
}: {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  colors: ThemeColors;
}) {
  return (
    <TouchableOpacity style={[fcStyles.featureCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]} onPress={onPress}>
      <View style={[fcStyles.iconContainer, { backgroundColor: colors.primaryLight }]}>
        <Feather name={icon} size={28} color={colors.primary} />
      </View>
      <View style={fcStyles.featureTextContainer}>
        <Text style={[fcStyles.featureTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[fcStyles.featureDescription, { color: colors.textMuted }]}>{description}</Text>
      </View>
      <Feather name="chevron-right" size={24} color={colors.textMuted} style={fcStyles.chevron} />
    </TouchableOpacity>
  );
}

const fcStyles = StyleSheet.create({
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  chevron: {
    marginLeft: 16,
  },
});

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
    fontSize: 16,
    color: colors.textMuted,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.border,
  },
  initialsAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  initialsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subscriptionSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  activeSubscriptionBox: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  deadlinesContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  deadlinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  deadlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  deadlineName: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  deadlineDate: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
    marginLeft: 16,
  },
  inactiveSubscriptionBox: {
    backgroundColor: colors.primaryLight,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inactiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  inactiveDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  upgradeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  featuresGrid: {
    gap: 16,
  },
});
