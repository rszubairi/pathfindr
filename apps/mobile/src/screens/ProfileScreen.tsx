import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Switch,
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Feather } from '@expo/vector-icons';
import type { Id } from '../../../../convex/_generated/dataModel';
import { ViewSection, DetailItem, TagCloud } from '../components/profile/ProfileViewComponents';
import { ProfileEditModal } from './ProfileEditModal';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useTheme, ThemeColors } from '../theme';

export function ProfileScreen({ navigation }: any) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();
  const [isEditVisible, setIsEditVisible] = useState(false);
  const styles = createStyles(colors);

  const profile = useQuery(
    api.profiles.getByUserId,
    user?.id ? { userId: user.id as Id<'users'> } : 'skip'
  );

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');

  if (profile === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (profile === null) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="user-plus" size={64} color={colors.border} />
        <Text style={styles.emptyTitle}>{t('mobile.profile.completeProfile')}</Text>
        <Text style={styles.emptySubtitle}>
          {t('mobile.profile.completeProfileDesc')}
        </Text>
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => setIsEditVisible(true)}
        >
          <Text style={styles.completeBtnText}>{t('mobile.profile.completeProfileBtn')}</Text>
        </TouchableOpacity>
        <ProfileEditModal
          visible={isEditVisible}
          onClose={() => setIsEditVisible(false)}
          initialData={{}}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Settings Row */}
        <View style={styles.settingsRow}>
          <View style={styles.themeToggle}>
            <Feather name={isDark ? 'moon' : 'sun'} size={16} color={colors.textMuted} />
            <Text style={styles.settingsLabel}>{isDark ? 'Dark' : 'Light'}</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#cbd5e1', true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.languageToggle}>
            <Text style={styles.settingsLabel}>{t('mobile.common.language')}</Text>
            <LanguageSwitcher />
          </View>
        </View>

        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarSection}>
            {user?.profileImageUrl ? (
              <Image source={{ uri: user.profileImageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.initialsAvatar}>
                <Text style={styles.initialsText}>{initials}</Text>
              </View>
            )}
            <View style={styles.headerInfo}>
              <Text style={styles.fullName}>{user?.fullName}</Text>
              <Text style={styles.email}>{user?.email}</Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: profile.profileStatus === 'verified' ? colors.success : colors.warning }]} />
                <Text style={styles.statusText}>
                  {profile.profileStatus?.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setIsEditVisible(true)}
          >
            <Feather name="edit-3" size={18} color={colors.primary} />
            <Text style={styles.editBtnText}>{t('mobile.profile.edit')}</Text>
          </TouchableOpacity>
        </View>

        <ProfileEditModal
          visible={isEditVisible}
          onClose={() => setIsEditVisible(false)}
          initialData={{
            personalDetails: {
              dateOfBirth: profile?.dateOfBirth,
              gender: profile?.gender,
              nationality: profile?.nationality,
              country: profile?.country,
              countryCode: profile?.countryCode,
              phone: profile?.phone,
            },
            education: profile?.education,
            testScores: profile?.testScores,
            certificates: profile?.certificates,
            projects: profile?.projects,
            skills: profile?.skills,
            interests: profile?.interests,
            preferredCountries: profile?.preferredCountries,
            availability: profile?.availability,
          }}
        />

        {/* Personal Details */}
        <ViewSection icon="user" title={t('mobile.profile.personalDetails')}>
          <View style={styles.grid}>
            <DetailItem label="Date of Birth" value={profile.dateOfBirth} />
            <DetailItem label="Gender" value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : undefined} />
            <DetailItem label="Nationality" value={profile.nationality} />
            <DetailItem label="Country" value={profile.country} />
            <DetailItem label="Phone" value={profile.phone ? `${profile.countryCode || ''} ${profile.phone}`.trim() : undefined} />
          </View>
        </ViewSection>

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <ViewSection icon="book-open" title={t('mobile.profile.educationHistory')}>
            {profile.education.map((edu: any, index: number) => (
              <View key={edu.id || index} style={[styles.itemBlock, index > 0 && styles.itemBorder]}>
                <Text style={styles.itemTitle}>{edu.institutionName}</Text>
                <Text style={styles.itemSubtitle}>
                  {edu.qualificationTitle} • {edu.fieldOfStudy}
                </Text>
                <Text style={styles.itemMeta}>
                  {edu.startDate} — {edu.endDate || 'Present'}
                </Text>
                {edu.gpa && <Text style={styles.itemGpa}>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </ViewSection>
        )}

        {/* Test Scores */}
        {Object.values(profile.testScores || {}).some(v => !!v) && (
          <ViewSection icon="file-text" title={t('mobile.profile.standardizedTests')}>
            <View style={styles.scoreRow}>
              {Object.entries(profile.testScores || {}).map(([key, val]) => val ? (
                <View key={key} style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>{key.toUpperCase()}</Text>
                  <Text style={styles.scoreValue}>{val as number}</Text>
                </View>
              ) : null)}
            </View>
          </ViewSection>
        )}

        {/* Certificates */}
        {profile.certificates && profile.certificates.length > 0 && (
          <ViewSection icon="award" title={t('mobile.profile.certifications')}>
            {profile.certificates.map((cert: any, index: number) => (
              <View key={cert.id || index} style={[styles.itemBlock, index > 0 && styles.itemBorder]}>
                <Text style={styles.itemTitle}>{cert.title}</Text>
                <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                <Text style={styles.itemMeta}>{cert.dateIssued}</Text>
              </View>
            ))}
          </ViewSection>
        )}

        {/* Skills & Interests */}
        {(profile.skills?.length > 0 || profile.interests?.length > 0) && (
          <ViewSection icon="zap" title={t('mobile.profile.skillsAndInterests')}>
            {profile.skills?.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.subLabel}>{t('mobile.profile.topSkills')}</Text>
                <TagCloud tags={profile.skills} color={colors.primary} />
              </View>
            )}
            {profile.interests?.length > 0 && (
              <View>
                <Text style={styles.subLabel}>{t('mobile.profile.interests')}</Text>
                <TagCloud tags={profile.interests} color="#7c3aed" />
              </View>
            )}
          </ViewSection>
        )}

        {/* Preferences */}
        <ViewSection icon="globe" title={t('mobile.profile.careerPreferences')}>
          <View>
            <Text style={styles.subLabel}>{t('mobile.profile.preferredCountries')}</Text>
            <TagCloud tags={profile.preferredCountries} color="#059669" />
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={styles.subLabel}>{t('mobile.profile.availability')}</Text>
            <Text style={styles.itemSubtitle}>{profile.availability || t('mobile.profile.notSpecified')}</Text>
          </View>
        </ViewSection>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  header: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  initialsAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  initialsText: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  headerInfo: { marginLeft: 16, flex: 1 },
  fullName: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  email: { fontSize: 14, color: colors.textMuted, marginBottom: 8 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, letterSpacing: 0.5 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  editBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  itemBlock: { paddingVertical: 10 },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.borderLight, marginTop: 8 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  itemSubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  itemMeta: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  itemGpa: { fontSize: 13, color: colors.primary, fontWeight: '600', marginTop: 4 },
  scoreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  scoreBox: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  scoreLabel: { fontSize: 10, fontWeight: '800', color: colors.textMuted, marginBottom: 4 },
  scoreValue: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  subLabel: { fontSize: 14, fontWeight: '600', color: colors.textMuted, marginBottom: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: colors.surface },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 24 },
  emptySubtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginTop: 12, marginBottom: 32, lineHeight: 24 },
  completeBtn: { backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  completeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
