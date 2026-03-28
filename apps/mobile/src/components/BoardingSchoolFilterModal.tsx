import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, ThemeColors } from '../theme';

const filterOptions = {
  states: [
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
    'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor',
    'Terengganu', 'W.P. Kuala Lumpur', 'W.P. Labuan', 'W.P. Putrajaya'
  ],
  categories: ['MRSM', 'MRSM Premier', 'SBP Premier', 'SMS', 'SBPI', 'SMAP', 'TMUA'],
  managedBy: ['KPM', 'MARA'],
  gender: ['male', 'female', 'mixed'],
};

interface BoardingSchoolFilters {
  states?: string[];
  categories?: string[];
  managedBy?: string[];
  gender?: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: BoardingSchoolFilters;
  onApply: (filters: BoardingSchoolFilters) => void;
}

export function BoardingSchoolFilterModal({ visible, onClose, filters, onApply }: FilterModalProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [localFilters, setLocalFilters] = useState<BoardingSchoolFilters>(filters);

  const toggleArrayFilter = (key: keyof BoardingSchoolFilters, value: string) => {
    const current = (localFilters[key] as string[]) || [];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setLocalFilters({ ...localFilters, [key]: next });
  };

  const setSingleFilter = (key: keyof BoardingSchoolFilters, value: string) => {
    setLocalFilters({ ...localFilters, [key]: localFilters[key] === value ? undefined : value });
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
            <Text style={styles.modalTitle}>Boarding School Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterScroll}>
            {/* Managed By Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Managed By</Text>
              <View style={styles.tagContainer}>
                {filterOptions.managedBy.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.tag,
                      localFilters.managedBy?.includes(m) && styles.activeTag
                    ]}
                    onPress={() => toggleArrayFilter('managedBy', m)}
                  >
                    <Text style={[
                      styles.tagText,
                      localFilters.managedBy?.includes(m) && styles.activeTagText
                    ]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Categories Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.tagContainer}>
                {filterOptions.categories.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.tag,
                      localFilters.categories?.includes(c) && styles.activeTag
                    ]}
                    onPress={() => toggleArrayFilter('categories', c)}
                  >
                    <Text style={[
                      styles.tagText,
                      localFilters.categories?.includes(c) && styles.activeTagText
                    ]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Gender Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gender</Text>
              <View style={styles.tagContainer}>
                {filterOptions.gender.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.tag,
                      localFilters.gender === g && styles.activeTag
                    ]}
                    onPress={() => setSingleFilter('gender', g)}
                  >
                    <Text style={[
                      styles.tagText,
                      localFilters.gender === g && styles.activeTagText,
                      { textTransform: 'capitalize' }
                    ]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* States Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>States</Text>
              <View style={styles.tagContainer}>
                {filterOptions.states.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.tag,
                      localFilters.states?.includes(s) && styles.activeTag
                    ]}
                    onPress={() => toggleArrayFilter('states', s)}
                  >
                    <Text style={[
                      styles.tagText,
                      localFilters.states?.includes(s) && styles.activeTagText
                    ]}>
                      {s}
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
    height: '75%',
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
