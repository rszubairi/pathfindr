import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, ThemeColors } from '../theme';

const filterOptions = {
  countries: [
    'Australia', 'Canada', 'China', 'France', 'Germany', 'Indonesia', 'Japan',
    'Malaysia', 'New Zealand', 'Philippines', 'Singapore', 'South Korea',
    'Thailand', 'United Kingdom', 'United States', 'Vietnam'
  ],
  fields: [
    'Accounting', 'Agriculture', 'Architecture', 'Arts & Humanities', 'Biology',
    'Business Administration', 'Chemistry', 'Communications', 'Computer Science',
    'Dentistry', 'Design', 'Education', 'Engineering', 'Environmental Science',
    'Finance', 'Law', 'Marketing', 'Mathematics', 'Medicine', 'Nursing',
    'Pharmacy', 'Physics', 'Psychology', 'Science', 'Social Sciences'
  ],
  providerTypes: ['government', 'university', 'corporate', 'ngo', 'foundation', 'individual']
};

interface ScholarshipFilters {
  countries?: string[];
  fields?: string[];
  providerTypes?: string[];
  minValue?: number;
  maxValue?: number;
  deadlineWithinMonths?: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: ScholarshipFilters;
  onApply: (filters: ScholarshipFilters) => void;
}

export function FilterModal({ visible, onClose, filters, onApply }: FilterModalProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [localFilters, setLocalFilters] = useState<ScholarshipFilters>(filters);

  const toggleFilter = (key: keyof ScholarshipFilters, value: string) => {
    const current = (localFilters[key] as string[]) || [];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setLocalFilters({ ...localFilters, [key]: next });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const clearAll = () => {
    setLocalFilters({});
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterScroll}>
            {/* Countries Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Countries</Text>
              <View style={styles.tagContainer}>
                {filterOptions.countries.map(country => (
                  <TouchableOpacity
                    key={country}
                    style={[
                      styles.tag,
                      localFilters.countries?.includes(country) && styles.activeTag
                    ]}
                    onPress={() => toggleFilter('countries', country)}
                  >
                    <Text style={[
                      styles.tagText,
                      localFilters.countries?.includes(country) && styles.activeTagText
                    ]}>
                      {country}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Provider Types Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Provider Types</Text>
              <View style={styles.tagContainer}>
                {filterOptions.providerTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.tag,
                      localFilters.providerTypes?.includes(type) && styles.activeTag
                    ]}
                    onPress={() => toggleFilter('providerTypes', type)}
                  >
                    <Text style={[
                      styles.tagText,
                      localFilters.providerTypes?.includes(type) && styles.activeTagText,
                      { textTransform: 'capitalize' }
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Value Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scholarship Value (USD)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Min"
                  placeholderTextColor={colors.placeholderText}
                  keyboardType="numeric"
                  value={localFilters.minValue?.toString() || ''}
                  onChangeText={(v) => setLocalFilters({ ...localFilters, minValue: v ? parseInt(v) : undefined })}
                />
                <Text style={styles.inputSeparator}>to</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Max"
                  placeholderTextColor={colors.placeholderText}
                  keyboardType="numeric"
                  value={localFilters.maxValue?.toString() || ''}
                  onChangeText={(v) => setLocalFilters({ ...localFilters, maxValue: v ? parseInt(v) : undefined })}
                />
              </View>
            </View>

            {/* Deadline */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Deadline Within</Text>
              <View style={styles.tagContainer}>
                {[1, 3, 6, 12].map(months => (
                  <TouchableOpacity
                    key={months}
                    style={[
                      styles.tag,
                      localFilters.deadlineWithinMonths === months && styles.activeTag
                    ]}
                    onPress={() => setLocalFilters({ ...localFilters, deadlineWithinMonths: localFilters.deadlineWithinMonths === months ? undefined : months })}
                  >
                    <Text style={[
                      styles.tagText,
                      localFilters.deadlineWithinMonths === months && styles.activeTagText
                    ]}>
                      {months} {months === 1 ? 'month' : 'months'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  filterScroll: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.borderLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTag: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  activeTagText: {
    color: colors.primary,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBg,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    fontSize: 14,
    color: colors.inputText,
  },
  inputSeparator: {
    color: colors.textMuted,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 12,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  clearBtnText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 16,
  },
  applyBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
