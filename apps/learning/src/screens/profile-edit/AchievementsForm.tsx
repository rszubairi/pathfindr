import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, ThemeColors } from '../../theme';

export function AchievementsForm({ data, onUpdate }: any) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [certs, setCerts] = useState(data.certificates || []);
  const [projs, setProjs] = useState(data.projects || []);

  const updateCert = (index: number, key: string, value: string) => {
    const newCerts = [...certs];
    newCerts[index] = { ...newCerts[index], [key]: value };
    setCerts(newCerts);
    onUpdate({ certificates: newCerts });
  };

  const updateProj = (index: number, key: string, value: string) => {
    const newProjs = [...projs];
    newProjs[index] = { ...newProjs[index], [key]: value };
    setProjs(newProjs);
    onUpdate({ projects: newProjs });
  };

  const addCert = () => {
    const newCerts = [...certs, { id: Math.random().toString(), title: '', issuer: '', dateIssued: '' }];
    setCerts(newCerts);
  };

  const addProj = () => {
    const newProjs = [...projs, { id: Math.random().toString(), title: '', description: '', startDate: '', endDate: '' }];
    setProjs(newProjs);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Certifications</Text>
      {certs.map((cert: any, index: number) => (
        <View key={cert.id} style={styles.card}>
          <TextInput
            style={styles.input}
            value={cert.title}
            onChangeText={(v) => updateCert(index, 'title', v)}
            placeholder="Certificate Title"
            placeholderTextColor={colors.placeholderText}
          />
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            value={cert.issuer}
            onChangeText={(v) => updateCert(index, 'issuer', v)}
            placeholder="Issuing Authority"
            placeholderTextColor={colors.placeholderText}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.addSmall} onPress={addCert}>
        <Feather name="plus" size={16} color={colors.primary} />
        <Text style={styles.addSmallText}>Add Certificate</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Projects</Text>
      {projs.map((proj: any, index: number) => (
        <View key={proj.id} style={styles.card}>
          <TextInput
            style={styles.input}
            value={proj.title}
            onChangeText={(v) => updateProj(index, 'title', v)}
            placeholder="Project Title"
            placeholderTextColor={colors.placeholderText}
          />
          <TextInput
            style={[styles.input, { marginTop: 10, height: 80 }]}
            value={proj.description}
            onChangeText={(v) => updateProj(index, 'description', v)}
            placeholder="Brief description..."
            placeholderTextColor={colors.placeholderText}
            multiline
          />
        </View>
      ))}
      <TouchableOpacity style={styles.addSmall} onPress={addProj}>
        <Feather name="plus" size={16} color={colors.primary} />
        <Text style={styles.addSmallText}>Add Project</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  input: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 10, fontSize: 14, color: colors.inputText },
  addSmall: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  addSmallText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
});
