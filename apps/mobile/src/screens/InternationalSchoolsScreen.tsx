import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Platform 
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Feather } from '@expo/vector-icons';
import { InternationalSchoolFilterModal } from '../components/InternationalSchoolFilterModal';

export function InternationalSchoolsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const schools = useQuery(api.internationalSchools.filter, {
    ...filters
  });

  const filteredSchools = schools?.filter((s: any) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search school or city..."
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

      {schools === undefined ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={filteredSchools}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('UniversityDetail', { id: item._id, type: 'International' })}
              activeOpacity={0.7}
            >
              <View style={styles.accentLine} />
              <View style={styles.cardHeader}>
                <View style={styles.countryBadge}>
                  <Text style={styles.countryBadgeText}>{item.country}</Text>
                </View>
                <View style={[styles.statusBadge, item.status === 'closed' && styles.closedBadge]}>
                  <Text style={[styles.statusText, item.status === 'closed' && styles.closedText]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.schoolName}>{item.name}</Text>
              
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color="#94a3b8" />
                <Text style={styles.locationText}>{item.city}, {item.country}</Text>
              </View>

              <View style={styles.footer}>
                <View style={styles.tagContainer}>
                  {item.curriculum.slice(0, 2).map((c: string) => (
                    <View key={c} style={styles.tag}>
                      <Text style={styles.tagText}>{c}</Text>
                    </View>
                  ))}
                  {item.curriculum.length > 2 && (
                    <Text style={styles.moreText}>+{item.curriculum.length - 2} more</Text>
                  )}
                </View>
                <Feather name="chevron-right" size={20} color="#cbd5e1" />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="globe" size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Schools Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filters to find international schools.</Text>
            </View>
          }
        />
      )}

      <InternationalSchoolFilterModal 
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
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
    alignItems: 'center',
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
    backgroundColor: '#3b82f6',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  countryBadge: { backgroundColor: '#f0f9ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#e0f2fe' },
  countryBadgeText: { fontSize: 10, fontWeight: '700', color: '#0369a1' },
  statusBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#dcfce7' },
  closedBadge: { backgroundColor: '#fef2f2', borderColor: '#fee2e2' },
  statusText: { fontSize: 10, fontWeight: '700', color: '#166534' },
  closedText: { color: '#991b1b' },
  schoolName: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 4, lineHeight: 24 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  locationText: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  tagContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  tag: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  moreText: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },
});
