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
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useSubscription } from '../hooks/useSubscription';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useTheme, ThemeColors } from '../theme';

export function InternshipDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { user } = useSelector((state: RootState) => state.auth);

  const internship = useQuery(api.internships.getById, {
    id,
    userId: user?.id as Id<'users'> | undefined
  });

  const { isSubscribed, isLoading: subLoading } = useSubscription();
  const [applying, setApplying] = useState(false);

  if (!internship || subLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleApply = async () => {
    if (!isSubscribed) {
      Alert.alert(
        'Subscription Required',
        'Internship applications and company host details are exclusive to Pro and Expert members.',
        [
          { text: 'Not Now', style: 'cancel' },
          { text: 'Upgrade Plan', onPress: () => navigation.navigate('Subscription') },
        ]
      );
      return;
    }

    Alert.alert('Success', 'Your profile has been shared with the host organization. They will contact you if shortlisted.');
  };

  const isPrivate = internship.companyName === 'Private Company';
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return '#2563eb';
      case 'part-time': return '#a21caf';
      case 'remote': return '#059669';
      default: return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={[styles.jobTypeBadge, { backgroundColor: getJobTypeColor(internship.type) + '15', borderColor: getJobTypeColor(internship.type) + '30' }]}>
            <Text style={[styles.jobTypeBadgeText, { color: getJobTypeColor(internship.type) }]}>{internship.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{internship.title}</Text>
          <View style={styles.companyRow}>
            {isPrivate && <Feather name="lock" size={16} color={colors.placeholderText} style={{ marginRight: 6 }} />}
            <Text style={[styles.companyName, isPrivate && styles.privateText]}>
              {internship.companyName}
            </Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Feather name="map-pin" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{internship.location}</Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="clock" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{internship.duration || 'Flexible'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="dollar-sign" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{internship.salaryRange || 'Paid'}</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Role Overview</Text>
          <Text style={styles.description}>{internship.description}</Text>
        </View>

        {/* Responsibilities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsibilities</Text>
          {internship.responsibilities.map((item: string, index: number) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Requirements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {internship.requirements.map((item: string, index: number) => (
            <View key={index} style={styles.listItem}>
              <Feather name="check" size={14} color="#10b981" style={{ marginRight: 8, marginTop: 4 }} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.bottomActions}>
        <View style={styles.actionInfo}>
          <Text style={styles.footerLabel}>Application Deadline</Text>
          <Text style={styles.footerValue}>
            {new Date(internship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          disabled={applying}
        >
          {applying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.applyButtonText}>Apply for Interest</Text>
              <Feather name="arrow-right" size={18} color="#fff" style={{ marginLeft: 8 }} />
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
  jobTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  jobTypeBadgeText: { fontSize: 11, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.text, marginBottom: 12, lineHeight: 34 },
  companyRow: { flexDirection: 'row', alignItems: 'center' },
  companyName: { fontSize: 16, color: colors.textMuted, fontWeight: '500' },
  privateText: { color: colors.placeholderText, fontStyle: 'italic' },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: '45%',
  },
  infoText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', flexShrink: 1 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  description: { fontSize: 15, lineHeight: 24, color: colors.textSecondary },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: 12
  },
  listText: { fontSize: 15, color: colors.textSecondary, flex: 1, lineHeight: 22 },
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
  footerLabel: { fontSize: 11, color: colors.placeholderText, fontWeight: '600', marginBottom: 2 },
  footerValue: { fontSize: 14, color: colors.text, fontWeight: '700' },
  applyButton: {
    flex: 2,
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
