import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useTheme, ThemeColors } from '../../theme';

export function TestScoresForm({ data, onUpdate }: any) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [scores, setScores] = useState(data.testScores || {});

  const updateScore = (key: string, value: string) => {
    const updated = { ...scores, [key]: value ? Number(value) : undefined };
    setScores(updated);
    onUpdate({ testScores: updated });
  };

  const fields = [
    { key: 'sat', label: 'SAT Score', placeholder: 'e.g. 1540' },
    { key: 'ielts', label: 'IELTS Band', placeholder: 'e.g. 8.5' },
    { key: 'toefl', label: 'TOEFL Score', placeholder: 'e.g. 110' },
    { key: 'gre', label: 'GRE Score', placeholder: 'e.g. 330' },
    { key: 'gmat', label: 'GMAT Score', placeholder: 'e.g. 740' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Standardized Test Scores</Text>
      <Text style={styles.subtitle}>Enter your scores for competitive exams.</Text>

      <View style={styles.row}>
        {fields.map((field) => (
          <View key={field.key} style={styles.inputGroup}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={scores[field.key]?.toString()}
              onChangeText={(v) => updateScore(field.key, v)}
              placeholder={field.placeholder}
              placeholderTextColor={colors.placeholderText}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 24 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  inputGroup: { width: '47%', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 12, padding: 12, fontSize: 15, color: colors.inputText },
});
