import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, ThemeColors } from '../../theme';

export function EducationForm({ data, onUpdate }: any) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [entries, setEntries] = useState(data.education?.length > 0 ? data.education : [{
    id: Math.random().toString(36).substr(2, 9),
    institutionName: '',
    qualificationTitle: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    gpa: ''
  }]);

  const updateEntry = (index: number, key: string, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [key]: value };
    setEntries(newEntries);
    onUpdate({ education: newEntries });
  };

  const addEntry = () => {
    const newEntries = [...entries, {
      id: Math.random().toString(36).substr(2, 9),
      institutionName: '',
      qualificationTitle: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }];
    setEntries(newEntries);
  };

  const removeEntry = (index: number) => {
    const newEntries = entries.filter((_: any, i: number) => i !== index);
    setEntries(newEntries);
    onUpdate({ education: newEntries });
  };

  const qualifications = [
    'High School Diploma',
    'Associate Degree',
    'Bachelor of Arts',
    'Bachelor of Science',
    'Bachelor of Engineering',
    'Master of Arts',
    'Master of Science',
    'MBA',
    'PhD'
  ];

  return (
    <ScrollView style={styles.container}>
      {entries.map((entry: any, index: number) => (
        <View key={entry.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Education #{index + 1}</Text>
            {entries.length > 1 && (
              <TouchableOpacity onPress={() => removeEntry(index)}>
                <Feather name="trash-2" size={18} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Institution Name</Text>
            <TextInput
              style={styles.input}
              value={entry.institutionName}
              onChangeText={(v) => updateEntry(index, 'institutionName', v)}
              placeholder="e.g. Taylor's University"
              placeholderTextColor={colors.placeholderText}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Qualification</Text>
            <View style={styles.tagSelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {qualifications.slice(0, 5).map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={[styles.tag, entry.qualificationTitle === q && styles.activeTag]}
                    onPress={() => updateEntry(index, 'qualificationTitle', q)}
                  >
                    <Text style={[styles.tagText, entry.qualificationTitle === q && styles.activeTagText]}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Field of Study</Text>
            <TextInput
              style={styles.input}
              value={entry.fieldOfStudy}
              onChangeText={(v) => updateEntry(index, 'fieldOfStudy', v)}
              placeholder="e.g. Computer Science"
              placeholderTextColor={colors.placeholderText}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Start Year</Text>
              <TextInput
                style={styles.input}
                value={entry.startDate}
                onChangeText={(v) => updateEntry(index, 'startDate', v)}
                placeholder="2020"
                placeholderTextColor={colors.placeholderText}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>End Year</Text>
              <TextInput
                style={styles.input}
                value={entry.endDate}
                onChangeText={(v) => updateEntry(index, 'endDate', v)}
                placeholder="2024"
                placeholderTextColor={colors.placeholderText}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>GPA (Optional)</Text>
            <TextInput
              style={styles.input}
              value={entry.gpa?.toString()}
              onChangeText={(v) => updateEntry(index, 'gpa', v)}
              placeholder="e.g. 3.85"
              placeholderTextColor={colors.placeholderText}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={addEntry}>
        <Feather name="plus" size={20} color={colors.primary} />
        <Text style={styles.addBtnText}>Add Another Education</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.borderLight },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 12, padding: 12, fontSize: 15, color: colors.inputText },
  tagSelector: { flexDirection: 'row' },
  tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.borderLight, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  activeTag: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  tagText: { color: colors.textMuted, fontSize: 13 },
  activeTagText: { color: colors.primary, fontWeight: '700' },
  row: { flexDirection: 'row' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: colors.border, gap: 8, marginBottom: 20 },
  addBtnText: { color: colors.primary, fontWeight: '700' },
});
