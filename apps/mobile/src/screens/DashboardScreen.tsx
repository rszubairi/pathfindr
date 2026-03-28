import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { NotificationModal } from '../components/NotificationModal';

export function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isNotifVisible, setIsNotifVisible] = React.useState(false);

  const notifications = useQuery(
    api.notifications.getUserNotifications,
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
          <Text style={styles.title}>Welcome back,</Text>
          <Text style={styles.subtitle}>{user?.fullName || 'Student'}!</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.bellBtn} 
            onPress={() => setIsNotifVisible(true)}
          >
            <Feather name="bell" size={24} color="#1e293b" />
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
          <ActivityIndicator size="small" color="#2563eb" />
        ) : subscription ? (
          <View style={styles.activeSubscriptionBox}>
            <View style={styles.subHeader}>
              <Feather name="zap" size={24} color="#eab308" />
              <Text style={styles.subTitle}>
                {subscription.tier.toUpperCase()} PLAN
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{subscription.applicationsUsed}</Text>
                <Text style={styles.statLabel}>Applied</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {subscription.applicationsLimit - subscription.applicationsUsed}
                </Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
            </View>
            
            <View style={styles.deadlinesContainer}>
              <Text style={styles.deadlinesTitle}>Upcoming Scholarship Deadlines</Text>
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
            <Text style={styles.inactiveTitle}>Unlock Your Potential</Text>
            <Text style={styles.inactiveDesc}>
              Subscribe to access premium features, apply limits, and priority application processing.
            </Text>
            <TouchableOpacity 
              style={styles.upgradeBtn}
              onPress={() => navigation.navigate('Subscription')}
            >
              <Text style={styles.upgradeBtnText}>View Plans</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Explore Opportunities</Text>
        
        <View style={styles.featuresGrid}>
          <FeatureCard
            title="Scholarships"
            description="Discover and apply for scholarships"
            icon="award"
            onPress={() => navigation.navigate('Scholarships')}
          />
          <FeatureCard
            title="Internships"
            description="Find internship opportunities"
            icon="briefcase"
            onPress={() => navigation.navigate('Internships')}
          />
          <FeatureCard
            title="Boarding Schools"
            description="Discover top boarding schools"
            icon="book-open"
            onPress={() => navigation.navigate('BoardingSchools')}
          />
          <FeatureCard
            title="International Schools"
            description="Explore modern international education"
            icon="globe"
            onPress={() => navigation.navigate('InternationalSchools')}
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
}: {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={28} color="#2563eb" />
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      <Feather name="chevron-right" size={24} color="#64748b" style={styles.chevron} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    color: '#64748b',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e2e8f0',
  },
  initialsAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  initialsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  subscriptionSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  activeSubscriptionBox: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: '#1e293b',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  deadlinesContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  deadlinesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  deadlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  deadlineName: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  deadlineDate: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
    marginLeft: 16,
  },
  inactiveSubscriptionBox: {
    backgroundColor: '#eff6ff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  inactiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  inactiveDesc: {
    fontSize: 14,
    color: '#1e3a8a',
    marginBottom: 16,
    lineHeight: 20,
  },
  upgradeBtn: {
    backgroundColor: '#2563eb',
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
    color: '#1e293b',
    marginBottom: 16,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#eff6ff',
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
    color: '#1e293b',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  chevron: {
    marginLeft: 16,
  },
});
