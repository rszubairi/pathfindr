import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, ThemeColors } from '../../theme';

// ─── Institution suggestion list ────────────────────────────────────────────
const INSTITUTION_SUGGESTIONS = [
  // Malaysian Public Universities
  'Universiti Malaya (UM)',
  'Universiti Sains Malaysia (USM)',
  'Universiti Kebangsaan Malaysia (UKM)',
  'Universiti Putra Malaysia (UPM)',
  'Universiti Teknologi Malaysia (UTM)',
  'Universiti Teknologi MARA (UiTM)',
  'Universiti Islam Antarabangsa Malaysia (IIUM)',
  'Universiti Utara Malaysia (UUM)',
  'Universiti Malaysia Sarawak (UNIMAS)',
  'Universiti Malaysia Sabah (UMS)',
  'Universiti Pendidikan Sultan Idris (UPSI)',
  'Universiti Sains Islam Malaysia (USIM)',
  'Universiti Malaysia Terengganu (UMT)',
  'Universiti Malaysia Kelantan (UMK)',
  'Universiti Malaysia Perlis (UniMAP)',
  'Universiti Sultan Zainal Abidin (UniSZA)',
  'Universiti Tun Hussein Onn Malaysia (UTHM)',
  'Universiti Teknikal Malaysia Melaka (UTeM)',
  'Universiti Pertahanan Nasional Malaysia (UPNM)',
  'Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA)',
  // Malaysian Private Universities
  'Multimedia University (MMU)',
  'Universiti Tunku Abdul Rahman (UTAR)',
  'Universiti Tenaga Nasional (UNITEN)',
  'Universiti Kuala Lumpur (UniKL)',
  'Universiti Teknologi PETRONAS (UTP)',
  'Open University Malaysia (OUM)',
  'University of Selangor (UNISEL)',
  "Taylor's University",
  'Sunway University',
  'UCSI University',
  'Asia Pacific University of Technology & Innovation (APU)',
  'Management and Science University (MSU)',
  'SEGi University',
  // Foreign Branch Campuses in Malaysia
  'Monash University Malaysia',
  'University of Nottingham Malaysia',
  'Curtin University Malaysia',
  'Heriot-Watt University Malaysia',
  'University of Reading Malaysia',
  'Xiamen University Malaysia',
  // International Universities
  'Oxford University',
  'Cambridge University',
  'Harvard University',
  'Stanford University',
  'MIT',
  'Imperial College London',
  'University College London (UCL)',
  'National University of Singapore (NUS)',
  'Nanyang Technological University (NTU)',
  'Melbourne University',
  'Sydney University',
].sort();

// ─── Typeahead input ─────────────────────────────────────────────────────────
function InstitutionInput({
  value,
  onChange,
  styles,
  colors,
}: {
  value: string;
  onChange: (v: string) => void;
  styles: ReturnType<typeof createStyles>;
  colors: any;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = value.trim().length >= 2
    ? INSTITUTION_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelect = (name: string) => {
    onChange(name);
    setShowSuggestions(false);
  };

  return (
    <View style={styles.autocompleteWrapper}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(v) => {
          onChange(v);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          // Small delay so tap on suggestion registers before blur hides it
          setTimeout(() => setShowSuggestions(false), 150);
        }}
        placeholder="e.g. Taylor's University"
        placeholderTextColor={colors.placeholderText}
        autoCorrect={false}
        autoCapitalize="words"
      />
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          {suggestions.map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.dropdownItem}
              onPress={() => handleSelect(s)}
              activeOpacity={0.7}
            >
              <Feather name="search" size={13} color={colors.textMuted} style={{ marginRight: 8 }} />
              <Text style={styles.dropdownText} numberOfLines={1}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Main form ───────────────────────────────────────────────────────────────
export function EducationForm({ data, onUpdate }: any) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [entries, setEntries] = useState(
    data.education?.length > 0
      ? data.education
      : [{
          id: Math.random().toString(36).substr(2, 9),
          institutionName: '',
          qualificationTitle: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          gpa: '',
        }]
  );

  const updateEntry = (index: number, key: string, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [key]: value };
    setEntries(newEntries);
    onUpdate({ education: newEntries });
  };

  const addEntry = () => {
    const newEntries = [
      ...entries,
      {
        id: Math.random().toString(36).substr(2, 9),
        institutionName: '',
        qualificationTitle: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        gpa: '',
      },
    ];
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
    'PhD',
  ];

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
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

          {/* Institution — free-type with suggestions */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Institution Name</Text>
            <InstitutionInput
              value={entry.institutionName}
              onChange={(v) => updateEntry(index, 'institutionName', v)}
              styles={styles}
              colors={colors}
            />
          </View>

          {/* Qualification chips */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Qualification</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tagRow}>
                {qualifications.map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={[styles.tag, entry.qualificationTitle === q && styles.activeTag]}
                    onPress={() => updateEntry(index, 'qualificationTitle', q)}
                  >
                    <Text style={[styles.tagText, entry.qualificationTitle === q && styles.activeTagText]}>
                      {q}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Field of study */}
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

          {/* Dates */}
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

          {/* GPA */}
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { padding: 16 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
    input: {
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 12,
      padding: 12,
      fontSize: 15,
      color: colors.inputText,
    },
    // Autocomplete
    autocompleteWrapper: { position: 'relative', zIndex: 10 },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      marginTop: 2,
      zIndex: 999,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    dropdownText: { fontSize: 14, color: colors.text, flex: 1 },
    // Qualification chips
    tagRow: { flexDirection: 'row' },
    tagSelector: { flexDirection: 'row' },
    tag: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.borderLight,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeTag: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
    tagText: { color: colors.textMuted, fontSize: 13 },
    activeTagText: { color: colors.primary, fontWeight: '700' },
    row: { flexDirection: 'row' },
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: colors.border,
      gap: 8,
      marginBottom: 20,
    },
    addBtnText: { color: colors.primary, fontWeight: '700' },
  });
