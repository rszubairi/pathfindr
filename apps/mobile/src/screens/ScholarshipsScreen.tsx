import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Feather } from '@expo/vector-icons';
import { FilterModal } from '../components/ScholarshipFilterModal';

export function ScholarshipsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const scholarships = useQuery(api.scholarships.filter, {
    ...filters,
    status: 'active'
  });

  const filteredScholarships = scholarships?.filter((s: any) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUrgencyColor = (deadline: string) => {
    const d = new Date(deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    if (days < 14) return '#ef4444';
    if (days < 30) return '#f59e0b';
    return '#10b981';
  };

  const getProviderTypeColor = (type: string) => {
    switch (type) {
      case 'government': return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'corporate': return { bg: '#fdf4ff', text: '#a21caf', border: '#f5d0fe' };
      case 'university': return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      default: return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
    }
  };

  const formatValue = (val: number, cur: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search opportunities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterBtn, Object.keys(filters).length > 0 && styles.activeFilterBtn]} 
          onPress={() => setIsFilterVisible(true)}
        >
          <Feather name="sliders" size={20} color={Object.keys(filters).length > 0 ? '#fff' : '#64748b'} />
        </TouchableOpacity>
      </View>

      {scholarships === undefined ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={filteredScholarships}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const typeStyle = getProviderTypeColor(item.providerType);
            return (
              <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('ScholarshipDetail', { id: item._id })}
                activeOpacity={0.7}
              >
                <View style={[styles.accentLine, { backgroundColor: typeStyle.text }]} />
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: typeStyle.bg, borderColor: typeStyle.border }]}>
                    <Text style={[styles.badgeText, { color: typeStyle.text }]}>
                      {item.providerType.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.deadlineBadge}>
                    <Feather name="calendar" size={12} color={getUrgencyColor(item.deadline)} />
                    <Text style={[styles.deadlineText, { color: getUrgencyColor(item.deadline) }]}>
                      {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                </View>

                <Text style={styles.providerName}>{item.provider}</Text>
                <Text style={styles.scholarshipName} numberOfLines={2}>{item.name}</Text>

                <View style={styles.valueRow}>
                  <Text style={styles.valueText}>{formatValue(item.value, item.currency)}</Text>
                  <Text style={styles.valueLabel}>/year (est.)</Text>
                </View>

                <View style={styles.footer}>
                  <View style={styles.tags}>
                    {item.eligibleCountries.slice(0, 2).map((c: string) => (
                      <View key={c} style={styles.tag}>
                        <Text style={styles.tagText}>{c}</Text>
                      </View>
                    ))}
                    {item.eligibleCountries.length > 2 && (
                      <Text style={styles.moreTags}>+{item.eligibleCountries.length - 2} more</Text>
                    )}
                  </View>
                  <Feather name="chevron-right" size={20} color="#cbd5e1" />
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="search" size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Scholarships Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filters to find more opportunities.</Text>
            </View>
          }
        />
      )}

      <FilterModal 
        visible={isFilterVisible} 
        onClose={() => setIsFilterVisible(false)} 
        filters={filters}
        onApply={setFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    padding: 16, 
    paddingBottom: 8, 
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  searchBox: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f5f9', 
    borderRadius: 12, 
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 15, color: '#1e293b' },
  filterBtn: { 
    width: 44, 
    height: 44, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  activeFilterBtn: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden'
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  deadlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deadlineText: { fontSize: 12, fontWeight: '600' },
  providerName: { fontSize: 13, color: '#64748b', fontWeight: '500', marginBottom: 4 },
  scholarshipName: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 12, lineHeight: 24 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 16 },
  valueText: { fontSize: 24, fontWeight: '800', color: '#2563eb' },
  valueLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tag: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  moreTags: { fontSize: 12, color: '#94a3b8' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },
});
