import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Feather } from '@expo/vector-icons';
import type { Id } from '../../../../convex/_generated/dataModel';
import { PersonalDetailsForm } from './profile-edit/PersonalDetailsForm';
import { EducationForm } from './profile-edit/EducationForm';
import { TestScoresForm } from './profile-edit/TestScoresForm';
import { AchievementsForm } from './profile-edit/AchievementsForm';
import { PreferencesForm } from './profile-edit/PreferencesForm';
import { ExtracurricularsForm } from './profile-edit/ExtracurricularsForm';
import { useTheme, ThemeColors } from '../theme';

const STEPS = [
  { id: 1, name: 'Personal', icon: 'user' },
  { id: 2, name: 'Education', icon: 'book-open' },
  { id: 3, name: 'Scores', icon: 'file-text' },
  { id: 4, name: 'Achievements', icon: 'award' },
  { id: 5, name: 'Preferences', icon: 'globe' },
  { id: 6, name: 'Activities', icon: 'activity' },
];

export function ProfileEditModal({ visible, onClose, initialData }: any) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData || {});
  const [isSaving, setIsSaving] = useState(false);

  const upsertProfile = useMutation(api.profiles.upsert);

  const handleUpdate = (stepData: any) => {
    setFormData((prev: any) => ({ ...prev, ...stepData }));
  };

  const saveProfile = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const payload = {
        userId: user.id as Id<'users'>,
        dateOfBirth: formData.personalDetails?.dateOfBirth,
        gender: formData.personalDetails?.gender,
        nationality: formData.personalDetails?.nationality,
        country: formData.personalDetails?.country,
        countryCode: formData.personalDetails?.countryCode,
        phone: formData.personalDetails?.phone,
        education: (formData.education || []).map((edu: any) => ({
          ...edu,
          gpa: edu.gpa ? Number(edu.gpa) : undefined
        })),
        testScores: formData.testScores || {},
        certificates: formData.certificates || [],
        projects: formData.projects || [],
        skills: formData.skills || [],
        interests: formData.interests || [],
        preferredCountries: formData.preferredCountries || [],
        availability: formData.availability,
        extracurriculars: formData.extracurriculars || [],
      };

      await upsertProfile(payload);
      Alert.alert('Success', 'Profile updated successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile changes.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    const commonProps = { data: formData, onUpdate: handleUpdate, user };
    switch (currentStep) {
      case 1: return <PersonalDetailsForm {...commonProps} />;
      case 2: return <EducationForm {...commonProps} />;
      case 3: return <TestScoresForm {...commonProps} />;
      case 4: return <AchievementsForm {...commonProps} />;
      case 5: return <PreferencesForm {...commonProps} />;
      case 6: return <ExtracurricularsForm {...commonProps} />;
      default: return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <Feather name="x" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={saveProfile} style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} disabled={isSaving}>
            {isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Save</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.stepIndicator}>
          {STEPS.map((step) => (
            <TouchableOpacity
              key={step.id}
              onPress={() => setCurrentStep(step.id)}
              style={[styles.stepItem, currentStep === step.id && styles.activeStepItem]}
            >
              <Feather name={step.icon as any} size={18} color={currentStep === step.id ? colors.primary : colors.textMuted} />
              <Text style={[styles.stepText, currentStep === step.id && styles.activeStepText]}>{step.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.stepContent}>
          {renderStep()}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.navBtn, currentStep === 1 && styles.navBtnHidden]}
            onPress={() => setCurrentStep(s => s - 1)}
          >
            <Feather name="chevron-left" size={20} color={colors.textMuted} />
            <Text style={styles.navBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, styles.nextBtn, currentStep === 6 && styles.navBtnHidden]}
            onPress={() => setCurrentStep(s => s + 1)}
          >
            <Text style={[styles.navBtnText, styles.nextBtnText]}>Next</Text>
            <Feather name="chevron-right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: colors.card },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  iconBtn: { padding: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  saveBtn: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, minWidth: 80, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  stepIndicator: { flexDirection: 'row', padding: 12, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  stepItem: { flex: 1, alignItems: 'center', paddingVertical: 8, gap: 4, borderRadius: 8 },
  activeStepItem: { backgroundColor: colors.primaryLight },
  stepText: { fontSize: 10, fontWeight: '600', color: colors.textMuted },
  activeStepText: { color: colors.primary },
  stepContent: { flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderTopWidth: 1, borderTopColor: colors.borderLight },
  navBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, gap: 4 },
  navBtnHidden: { opacity: 0 },
  navBtnText: { fontSize: 16, fontWeight: '600', color: colors.textMuted },
  nextBtn: { backgroundColor: colors.primary, paddingHorizontal: 24 },
  nextBtnText: { color: '#fff' },
});
