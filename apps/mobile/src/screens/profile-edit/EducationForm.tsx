import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export function EducationForm({ data, onUpdate }: any) {
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
                <Feather name="trash-2" size={18} color="#ef4444" />
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
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={addEntry}>
        <Feather name="plus" size={20} color="#2563eb" />
        <Text style={styles.addBtnText}>Add Another Education</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, fontSize: 15 },
  tagSelector: { flexDirection: 'row' },
  tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  activeTag: { backgroundColor: '#eff6ff', borderColor: '#2563eb' },
  tagText: { color: '#64748b', fontSize: 13 },
  activeTagText: { color: '#2563eb', fontWeight: '700' },
  row: { flexDirection: 'row' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', gap: 8, marginBottom: 20 },
  addBtnText: { color: '#2563eb', fontWeight: '700' },
});
