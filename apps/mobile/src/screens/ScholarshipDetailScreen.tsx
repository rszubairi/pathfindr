import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useQuery } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../convex/_generated/api';
import { Feather } from '@expo/vector-icons';
import { useApplyGate } from '../hooks/useApplyGate';
import { useTheme, ThemeColors } from '../theme';

export function ScholarshipDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  const scholarship = useQuery(api.scholarships.getById, { id });
  const {
    checkGate,
    apply,
    alreadyApplied,
    loading: gateLoading,
    isSubscribed,
    applicationsUsed,
    applicationsLimit,
  } = useApplyGate(id);

  const [applying, setApplying] = useState(false);

  if (!scholarship || gateLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleApply = async () => {
    const result = checkGate();

    if (!result.allowed) {
      if (result.reason === 'auth') {
        Alert.alert(t('mobile.details.loginRequired'), t('mobile.details.pleaseSignIn'), [
          { text: t('mobile.details.cancel'), style: 'cancel' },
          { text: t('mobile.details.signIn'), onPress: () => navigation.navigate('Login') },
        ]);
        return;
      }
      if (result.reason === 'subscribe') {
        Alert.alert(
          t('mobile.details.subscriptionRequired'),
          t('mobile.details.upgradeToApply'),
          [
            { text: t('mobile.details.notNow'), style: 'cancel' },
            { text: t('mobile.details.upgradePlan'), onPress: () => navigation.navigate('Subscription') },
          ]
        );
        return;
      }
      if (result.reason === 'limit_reached') {
        Alert.alert(
          t('mobile.details.limitReached'),
          t('mobile.details.limitReachedDesc'),
          [
            { text: t('mobile.details.ok'), style: 'cancel' },
            { text: t('mobile.details.viewPlans'), onPress: () => navigation.navigate('Subscription') },
          ]
        );
        return;
      }
      if (result.reason === 'already_applied') {
        Alert.alert(t('mobile.details.alreadyAppliedTitle'), t('mobile.details.alreadyAppliedDesc'));
        return;
      }
      return;
    }

    try {
      setApplying(true);
      await apply();
      if (scholarship.applicationUrl) {
        Linking.openURL(scholarship.applicationUrl);
      } else {
        Alert.alert(t('mobile.details.success'), t('mobile.details.appTracked'));
      }
    } catch (error) {
      Alert.alert(t('mobile.details.error'), t('mobile.details.failedProcess'));
    } finally {
      setApplying(false);
    }
  };

  const isPending = scholarship.status === 'pending';
  const isClosed = scholarship.status === 'closed';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.providerBadge}>
            <Text style={styles.providerBadgeText}>{scholarship.providerType.toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{scholarship.name}</Text>
          <View style={styles.providerRow}>
            <Feather name="briefcase" size={16} color={colors.textMuted} />
            <Text style={styles.providerName}>{scholarship.provider}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.primaryLight, borderColor: '#bfdbfe' }]}>
            <View style={styles.statIconHeader}>
              <Feather name="dollar-sign" size={14} color={colors.primary} />
              <Text style={styles.statLabel}>{t('mobile.details.value')}</Text>
            </View>
            <Text style={styles.statValue}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: scholarship.currency,
                maximumFractionDigits: 0,
              }).format(scholarship.value)}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#fdf4ff', borderColor: '#f5d0fe' }]}>
            <View style={styles.statIconHeader}>
              <Feather name="calendar" size={14} color="#a21caf" />
              <Text style={styles.statLabel}>{t('mobile.details.deadline')}</Text>
            </View>
            <Text style={styles.statValue}>
              {new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('mobile.details.aboutScholarship')}</Text>
          <Text style={styles.description}>
            {scholarship.description || t('mobile.details.noDescription')}
          </Text>
        </View>

        {/* Eligibility Section */}
        {scholarship.eligibilityCriteria && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('mobile.details.eligibilityCriteria')}</Text>
            {Object.entries(scholarship.eligibilityCriteria).map(([key, value]: [string, any]) => (
              <View key={key} style={styles.criteriaRow}>
                <Text style={styles.criteriaKey}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
                <Text style={styles.criteriaValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Requirements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('mobile.details.globalApplicability')}</Text>
          <View style={styles.infoRow}>
            <Feather name="globe" size={16} color={colors.textMuted} />
            <Text style={styles.infoLabel}>{t('mobile.details.eligibleCountries')}</Text>
            <Text style={styles.infoValue}>{scholarship.eligibleCountries.join(', ')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="book-open" size={16} color={colors.textMuted} />
            <Text style={styles.infoLabel}>{t('mobile.details.eligibleFields')}</Text>
            <Text style={styles.infoValue}>{scholarship.eligibleFields.join(', ')}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.bottomActions}>
        <View style={styles.actionInfo}>
          {isSubscribed ? (
            <Text style={styles.usageText}>
              {t('mobile.details.usedApps', { count: applicationsUsed, limit: applicationsLimit })}
            </Text>
          ) : (
            <Text style={styles.freeText}>{t('mobile.details.freePreview')}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.applyButton,
            (isPending || isClosed || alreadyApplied) && styles.disabledButton,
          ]}
          onPress={handleApply}
          disabled={isPending || isClosed || alreadyApplied || applying}
        >
          {applying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.applyButtonText}>
                {isPending ? t('mobile.details.openingSoon') : isClosed ? t('mobile.details.deadlinePassed') : alreadyApplied ? t('mobile.details.alreadyApplied') : t('mobile.details.applyNow')}
              </Text>
              {!isPending && !isClosed && !alreadyApplied && (
                <Feather name="external-link" size={18} color="#fff" style={{ marginLeft: 8 }} />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card },
  container: { flex: 1, backgroundColor: colors.card },
  content: { flex: 1, padding: 24 },
  header: { marginBottom: 24 },
  providerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 12,
  },
  providerBadgeText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 8, lineHeight: 36 },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  providerName: { fontSize: 16, color: colors.textMuted, fontWeight: '500' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIconHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  statLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  statValue: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  description: { fontSize: 15, lineHeight: 24, color: colors.textSecondary },
  criteriaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight
  },
  criteriaKey: { fontSize: 14, color: colors.textMuted, fontWeight: '500' },
  criteriaValue: { fontSize: 14, color: colors.text, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  infoLabel: { fontSize: 14, fontWeight: '600', color: colors.text, width: 130 },
  infoValue: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  actionInfo: { flex: 1 },
  usageText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  freeText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  applyButton: {
    flex: 2,
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  disabledButton: { backgroundColor: colors.border },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
