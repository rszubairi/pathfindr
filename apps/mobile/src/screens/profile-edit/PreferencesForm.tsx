import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { TagCloud } from '../../components/profile/ProfileViewComponents';

export function PreferencesForm({ data, onUpdate }: any) {
  const [pref, setPref] = useState({
    skills: data.skills || [],
    interests: data.interests || [],
    preferredCountries: data.preferredCountries || [],
    availability: data.availability || ''
  });

  const handleUpdate = (key: string, value: any) => {
    const updated = { ...pref, [key]: value };
    setPref(updated);
    onUpdate(updated);
  };

  const handleTagInput = (key: string, text: string) => {
    if (text.endsWith(',') || text.endsWith('\n')) {
      const tag = text.trim().replace(',', '');
      if (tag && !pref[key as keyof typeof pref].includes(tag)) {
        handleUpdate(key, [...(pref[key as keyof typeof pref] as string[]), tag]);
      }
      return '';
    }
    return text;
  };

  const [skillText, setSkillText] = useState('');
  const [interestText, setInterestText] = useState('');
  const [countryText, setCountryText] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Top Skills (comma separated)</Text>
      <TextInput
        style={styles.input}
        value={skillText}
        onChangeText={(v) => setSkillText(handleTagInput('skills', v))}
        placeholder="e.g. Python, SQL"
      />
      <View style={{ marginTop: 8 }}>
        <TagCloud tags={pref.skills} color="#2563eb" />
      </View>

      <Text style={[styles.label, { marginTop: 24 }]}>Interests</Text>
      <TextInput
        style={styles.input}
        value={interestText}
        onChangeText={(v) => setInterestText(handleTagInput('interests', v))}
        placeholder="e.g. AI, Music"
      />
      <View style={{ marginTop: 8 }}>
        <TagCloud tags={pref.interests} color="#7c3aed" />
      </View>

      <Text style={[styles.label, { marginTop: 24 }]}>Preferred Countries</Text>
      <TextInput
        style={styles.input}
        value={countryText}
        onChangeText={(v) => setCountryText(handleTagInput('preferredCountries', v))}
        placeholder="e.g. UK, USA"
      />
      <View style={{ marginTop: 8 }}>
        <TagCloud tags={pref.preferredCountries} color="#059669" />
      </View>

      <Text style={[styles.label, { marginTop: 24 }]}>Availability</Text>
      <TextInput
        style={styles.input}
        value={pref.availability}
        onChangeText={(v) => handleUpdate('availability', v)}
        placeholder="e.g. Immediate, Next year"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, fontSize: 15 },
});
