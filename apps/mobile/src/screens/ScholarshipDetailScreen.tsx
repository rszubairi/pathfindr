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
import { api } from '../../../../convex/_generated/api';
import { Feather } from '@expo/vector-icons';
import { useApplyGate } from '../hooks/useApplyGate';

export function ScholarshipDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
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
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const handleApply = async () => {
    const result = checkGate();

    if (!result.allowed) {
      if (result.reason === 'auth') {
        Alert.alert('Login Required', 'Please sign in to apply for scholarships.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') },
        ]);
        return;
      }
      if (result.reason === 'subscribe') {
        Alert.alert(
          'Subscription Required',
          'This feature is only available for Pro and Expert members. Upgrade your plan to start applying!',
          [
            { text: 'Not Now', style: 'cancel' },
            { text: 'Upgrade Plan', onPress: () => navigation.navigate('Subscription') },
          ]
        );
        return;
      }
      if (result.reason === 'limit_reached') {
        Alert.alert(
          'Limit Reached',
          'You have reached your application limit for this month. Upgrade to Expert for unlimited applications!',
          [
            { text: 'OK', style: 'cancel' },
            { text: 'View Plans', onPress: () => navigation.navigate('Subscription') },
          ]
        );
        return;
      }
      if (result.reason === 'already_applied') {
        Alert.alert('Already Applied', 'You have already submitted an application for this scholarship.');
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
        Alert.alert('Success', 'Application tracked! Please complete any remaining steps on the provider website.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process application. Please try again.');
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
            <Feather name="briefcase" size={16} color="#64748b" />
            <Text style={styles.providerName}>{scholarship.provider}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
            <View style={styles.statIconHeader}>
              <Feather name="dollar-sign" size={14} color="#2563eb" />
              <Text style={styles.statLabel}>Value</Text>
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
              <Text style={styles.statLabel}>Deadline</Text>
            </View>
            <Text style={styles.statValue}>
              {new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Scholarship</Text>
          <Text style={styles.description}>
            {scholarship.description || 'No description available for this scholarship.'}
          </Text>
        </View>

        {/* Eligibility Section */}
        {scholarship.eligibilityCriteria && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
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
          <Text style={styles.sectionTitle}>Global Applicability</Text>
          <View style={styles.infoRow}>
            <Feather name="globe" size={16} color="#64748b" />
            <Text style={styles.infoLabel}>Eligible Countries:</Text>
            <Text style={styles.infoValue}>{scholarship.eligibleCountries.join(', ')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="book-open" size={16} color="#64748b" />
            <Text style={styles.infoLabel}>Fields of Study:</Text>
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
              Used {applicationsUsed}/{applicationsLimit} apps
            </Text>
          ) : (
            <Text style={styles.freeText}>Free Preview</Text>
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
                {isPending ? 'Opening Soon' : isClosed ? 'Deadline Passed' : alreadyApplied ? 'Already Applied' : 'Apply Now'}
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

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24 },
  header: { marginBottom: 24 },
  providerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 12,
  },
  providerBadgeText: { fontSize: 10, fontWeight: '700', color: '#2563eb' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 8, lineHeight: 36 },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  providerName: { fontSize: 16, color: '#64748b', fontWeight: '500' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIconHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 16 },
  description: { fontSize: 15, lineHeight: 24, color: '#475569' },
  criteriaRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9' 
  },
  criteriaKey: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  criteriaValue: { fontSize: 14, color: '#1e293b', fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#1e293b', width: 130 },
  infoValue: { fontSize: 14, color: '#475569', flex: 1 },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  actionInfo: { flex: 1 },
  usageText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  freeText: { fontSize: 12, color: '#2563eb', fontWeight: '600' },
  applyButton: {
    flex: 2,
    backgroundColor: '#2563eb',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  disabledButton: { backgroundColor: '#cbd5e1' },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
