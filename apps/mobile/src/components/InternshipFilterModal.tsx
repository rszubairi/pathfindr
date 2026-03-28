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

const filterOptions = {
  types: ['full-time', 'part-time', 'remote'],
  locations: ['Singapore', 'Kuala Lumpur', 'Remote', 'Hong Kong', 'Sydney', 'London', 'New York'],
};

interface InternshipFilters {
  types?: string[];
  locations?: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: InternshipFilters;
  onApply: (filters: InternshipFilters) => void;
}

export function InternshipFilterModal({ visible, onClose, filters, onApply }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<InternshipFilters>(filters);

  const toggleFilter = (key: keyof InternshipFilters, value: string) => {
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
            <Text style={styles.modalTitle}>Internship Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#1e293b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterScroll}>
            {/* Types Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Role Types</Text>
              <View style={styles.tagContainer}>
                {filterOptions.types.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.tag,
                      localFilters.types?.includes(type) && styles.activeTag
                    ]}
                    onPress={() => toggleFilter('types', type)}
                  >
                    <Text style={[
                      styles.tagText,
                      localFilters.types?.includes(type) && styles.activeTagText,
                      { textTransform: 'capitalize' }
                    ]}>
                      {type.replace('-', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Locations Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Locations</Text>
              <View style={styles.tagContainer}>
                {filterOptions.locations.map(location => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.tag,
                      localFilters.locations?.includes(location) && styles.activeTag
                    ]}
                    onPress={() => toggleFilter('locations', location)}
                  >
                    <Text style={[
                      styles.tagText,
                      localFilters.locations?.includes(location) && styles.activeTagText
                    ]}>
                      {location}
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
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
    color: '#1e293b',
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
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeTag: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  tagText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeTagText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 16,
  },
  applyBtn: {
    flex: 2,
    backgroundColor: '#2563eb',
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
