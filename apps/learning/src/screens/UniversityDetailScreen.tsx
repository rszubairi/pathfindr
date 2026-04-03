import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useSubscription } from '../hooks/useSubscription';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useTheme, ThemeColors } from '../theme';

export function UniversityDetailScreen({ route, navigation }: any) {
  const { id, type } = route.params;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { user } = useSelector((state: RootState) => state.auth);
  const { isSubscribed, isLoading: subLoading } = useSubscription();

  const school = useQuery(
    type === 'Boarding' ? api.boardingSchools.getById : api.internationalSchools.getById,
    { id }
  );

  // Helper to safely access properties from union types
  const s = (data: any) => data || {};


  const isSubscribedToNotifications = useQuery(
    api.boardingSchoolNotifications.hasUserSubscribed,
    user?.id && type === 'Boarding' ? { userId: user.id as Id<'users'>, schoolId: id } : 'skip'
  );

  const subscribe = useMutation(api.boardingSchoolNotifications.subscribe);
  const unsubscribe = useMutation(api.boardingSchoolNotifications.unsubscribe);

  const [actionLoading, setActionLoading] = useState(false);

  if (!school || subLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleToggleReminder = async () => {
    if (type !== 'Boarding') return;
    if (!user) {
      Alert.alert('Sign In Required', 'Please log in to set application reminders.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    // Subscription Gate for NEW subscriptions only
    if (!isSubscribed && !isSubscribedToNotifications) {
      Alert.alert(
        'Premium Feature',
        'Boarding school admission alerts are exclusive to Pro and Expert members.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => navigation.navigate('Subscription') }
        ]
      );
      return;
    }

    setActionLoading(true);
    try {
      if (isSubscribedToNotifications) {
        await unsubscribe({ userId: user.id as Id<'users'>, schoolId: id });
        Alert.alert('Reminder Removed', 'You will no longer receive notifications for this school.');
      } else {
        await subscribe({ userId: user.id as Id<'users'>, schoolId: id, email: user.email });
        Alert.alert('Reminder Set!', 'We will notify you at ' + user.email + ' when admission windows open.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update reminder settings.');
    } finally {
      setActionLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    if (!category) return '#3b82f6';
    if (category.includes('MRSM')) return '#c2410c';
    if (category.includes('SBP')) return '#0369a1';
    return '#6d28d9';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[
            styles.categoryBadge,
            {
              backgroundColor: getCategoryColor(s(school).category || 'International') + '15',
              borderColor: getCategoryColor(s(school).category || 'International') + '30'
            }
          ]}>
            <Text style={[styles.categoryBadgeText, { color: getCategoryColor(s(school).category || 'International') }]}>
              {s(school).category || 'International School'}
            </Text>
          </View>
          <Text style={styles.title}>{s(school).name}</Text>
          <View style={styles.metaRow}>
            <Feather name="map-pin" size={16} color={colors.textMuted} />
            <Text style={styles.metaText}>
              {s(school).city || s(school).district}, {s(school).country || s(school).state}
            </Text>
          </View>
        </View>

        {/* Quick Info */}
        <View style={styles.infoGrid}>
          {type === 'Boarding' ? (
            <>
              <View style={styles.infoItem}>
                <Feather name="shield" size={18} color={colors.primary} />
                <View>
                  <Text style={styles.infoLabel}>Managed By</Text>
                  <Text style={styles.infoValue}>{s(school).managedBy}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Feather name="users" size={18} color={colors.primary} />
                <View>
                  <Text style={styles.infoLabel}>Gender</Text>
                  <Text style={styles.infoValue}>{s(school).gender?.toUpperCase()}</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoItem}>
                <Feather name="layers" size={18} color={colors.primary} />
                <View>
                  <Text style={styles.infoLabel}>Grades</Text>
                  <Text style={styles.infoValue}>{s(school).grades}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Feather name="dollar-sign" size={18} color={colors.primary} />
                <View>
                  <Text style={styles.infoLabel}>Annual Fees</Text>
                  <Text style={styles.infoValue}>{s(school).annualFees || 'Varies'}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Description */}
        {s(school).description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the School</Text>
            <Text style={styles.description}>{s(school).description}</Text>
          </View>
        )}

        {/* Dynamic Sections */}
        {type === 'Boarding' ? (
           <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Entry Levels</Text>
              <View style={styles.tagContainer}>
                {s(school).entryLevels?.map((lvl: string) => (
                  <View key={lvl} style={styles.levelTag}>
                    <Text style={styles.levelTagText}>{lvl}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special Programs</Text>
              {s(school).specialPrograms?.map((prog: string, index: number) => (
                <View key={index} style={styles.progItem}>
                  <Feather name="star" size={14} color="#f59e0b" style={{ marginTop: 4 }} />
                  <Text style={styles.progText}>{prog}</Text>
                </View>
              ))}
            </View>
           </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Curriculum</Text>
            <View style={styles.tagContainer}>
              {s(school).curriculum?.map((c: string) => (
                <View key={c} style={styles.levelTag}>
                  <Text style={styles.levelTagText}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.deadlineInfo}>
          <Text style={styles.deadlineLabel}>
            {type === 'Boarding' ? 'Admission Window' : 'Location'}
          </Text>
          <Text style={styles.deadlineValue}>
            {type === 'Boarding' ? s(school).applicationPeriod : s(school).city}
          </Text>
        </View>

        {type === 'Boarding' ? (
          <TouchableOpacity
            style={[
              styles.reminderBtn,
              isSubscribedToNotifications && styles.reminderBtnActive
            ]}
            onPress={handleToggleReminder}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator color={isSubscribedToNotifications ? colors.primary : '#fff'} />
            ) : (
              <>
                <Feather
                  name={isSubscribedToNotifications ? 'bell-off' : 'bell'}
                  size={18}
                  color={isSubscribedToNotifications ? colors.primary : '#fff'}
                />
                <Text style={[
                  styles.reminderBtnText,
                  isSubscribedToNotifications && styles.reminderBtnTextActive
                ]}>
                  {isSubscribedToNotifications ? 'Unsubscribe' : 'Notify Me'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.reminderBtn}
            onPress={() => Alert.alert('External Link', 'Opening official school website...')}
          >
            <Feather name="external-link" size={18} color="#fff" />
            <Text style={styles.reminderBtnText}>Visit Website</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.card },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 24 },
  header: { marginBottom: 32 },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  categoryBadgeText: { fontSize: 12, fontWeight: '800' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 12, lineHeight: 36 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 16, color: colors.textMuted, fontWeight: '500' },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    gap: 24
  },
  infoItem: { flexDirection: 'row', gap: 12, flex: 1 },
  infoLabel: { fontSize: 12, color: colors.placeholderText, fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 15, color: colors.text, fontWeight: '700' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  description: { fontSize: 15, lineHeight: 24, color: colors.textSecondary },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  levelTag: { backgroundColor: colors.borderLight, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  levelTagText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  progItem: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  progText: { fontSize: 15, color: colors.textSecondary, flex: 1, lineHeight: 22 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  deadlineInfo: { flex: 1 },
  deadlineLabel: { fontSize: 11, color: colors.placeholderText, fontWeight: '600', marginBottom: 2 },
  deadlineValue: { fontSize: 14, color: colors.text, fontWeight: '700' },
  reminderBtn: {
    flex: 1.5,
    backgroundColor: colors.primary,
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  reminderBtnActive: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  reminderBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  reminderBtnTextActive: { color: colors.primary },
});
