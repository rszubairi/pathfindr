import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, ThemeColors } from '../../theme';

const CATEGORIES = [
  { value: 'sports', label: 'Sports' },
  { value: 'arts', label: 'Arts & Music' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'community', label: 'Community Service' },
  { value: 'academic_club', label: 'Academic Club' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'other', label: 'Other' },
] as const;

const EDUCATION_LEVELS = [
  { value: 'school', label: 'School' },
  { value: 'college', label: 'College' },
  { value: 'university', label: 'University' },
] as const;

type Category = typeof CATEGORIES[number]['value'];
type EducationLevel = typeof EDUCATION_LEVELS[number]['value'];

interface Activity {
  id: string;
  name: string;
  category: Category;
  role: string;
  educationLevel: EducationLevel;
  startDate: string;
  endDate?: string;
  description?: string;
  achievement?: string;
}

export function ExtracurricularsForm({ data, onUpdate }: any) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [activities, setActivities] = useState<Activity[]>(data.extracurriculars || []);

  const update = (index: number, key: keyof Activity, value: string) => {
    const next = [...activities];
    next[index] = { ...next[index], [key]: value };
    setActivities(next);
    onUpdate({ extracurriculars: next });
  };

  const add = () => {
    const next: Activity[] = [
      ...activities,
      {
        id: Math.random().toString(36).slice(2),
        name: '',
        category: 'sports',
        role: '',
        educationLevel: 'school',
        startDate: '',
        endDate: '',
        description: '',
        achievement: '',
      },
    ];
    setActivities(next);
    onUpdate({ extracurriculars: next });
  };

  const remove = (index: number) => {
    const next = activities.filter((_, i) => i !== index);
    setActivities(next);
    onUpdate({ extracurriculars: next });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Extracurricular Activities</Text>
      <Text style={styles.sectionSubtitle}>
        Add activities from school, college, or university — sports, clubs, volunteer work, leadership roles, and more.
      </Text>

      {activities.map((activity, index) => (
        <View key={activity.id} style={styles.card}>
          {/* Card header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Activity {index + 1}</Text>
            <TouchableOpacity onPress={() => remove(index)} style={styles.removeBtn}>
              <Feather name="trash-2" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* Activity name */}
          <TextInput
            style={styles.input}
            value={activity.name}
            onChangeText={(v) => update(index, 'name', v)}
            placeholder="Activity name (e.g., Football Team, Chess Club)"
            placeholderTextColor={colors.placeholderText}
          />

          {/* Role */}
          <TextInput
            style={[styles.input, styles.inputTop]}
            value={activity.role}
            onChangeText={(v) => update(index, 'role', v)}
            placeholder="Your role (e.g., Captain, Member, President)"
            placeholderTextColor={colors.placeholderText}
          />

          {/* Category picker */}
          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[styles.chip, activity.category === cat.value && styles.chipActive]}
                onPress={() => update(index, 'category', cat.value)}
              >
                <Text style={[styles.chipText, activity.category === cat.value && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Education level picker */}
          <Text style={styles.fieldLabel}>Education Level</Text>
          <View style={styles.chipRow}>
            {EDUCATION_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[styles.chip, activity.educationLevel === level.value && styles.chipActive]}
                onPress={() => update(index, 'educationLevel', level.value)}
              >
                <Text style={[styles.chipText, activity.educationLevel === level.value && styles.chipTextActive]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dates */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Start Date</Text>
              <TextInput
                style={styles.input}
                value={activity.startDate}
                onChangeText={(v) => update(index, 'startDate', v)}
                placeholder="e.g., Jan 2022"
                placeholderTextColor={colors.placeholderText}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>End Date</Text>
              <TextInput
                style={styles.input}
                value={activity.endDate}
                onChangeText={(v) => update(index, 'endDate', v)}
                placeholder="e.g., Dec 2023"
                placeholderTextColor={colors.placeholderText}
              />
            </View>
          </View>

          {/* Achievement / grade equivalent */}
          <Text style={styles.fieldLabel}>Achievement / Award</Text>
          <TextInput
            style={styles.input}
            value={activity.achievement}
            onChangeText={(v) => update(index, 'achievement', v)}
            placeholder="e.g., 1st place nationals, Gold medal, Best Speaker"
            placeholderTextColor={colors.placeholderText}
          />

          {/* Description */}
          <Text style={styles.fieldLabel}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={activity.description}
            onChangeText={(v) => update(index, 'description', v)}
            placeholder="Brief description of your involvement..."
            placeholderTextColor={colors.placeholderText}
            multiline
            numberOfLines={3}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={add}>
        <Feather name="plus" size={16} color={colors.primary} />
        <Text style={styles.addBtnText}>Add Activity</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
    sectionSubtitle: { fontSize: 13, color: colors.textMuted, marginBottom: 16, lineHeight: 18 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    cardLabel: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
    removeBtn: { padding: 4 },
    input: {
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      padding: 10,
      fontSize: 14,
      color: colors.inputText,
    },
    inputTop: { marginTop: 10 },
    fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginTop: 12, marginBottom: 6 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    chipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
    chipText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
    chipTextActive: { color: colors.primary },
    row: { flexDirection: 'row', gap: 10, marginTop: 0 },
    halfField: { flex: 1 },
    textarea: { height: 72, textAlignVertical: 'top' },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10 },
    addBtnText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  });
