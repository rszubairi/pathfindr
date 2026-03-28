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
import { BoardingSchoolFilterModal } from '../components/BoardingSchoolFilterModal';

export function BoardingSchoolsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const boardingSchoolsSelection = useQuery(api.boardingSchools.filter, {
    ...filters
  });

  const filteredSchools = boardingSchoolsSelection?.filter((s: any) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.shortName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryTheme = (category: string) => {
    if (category.includes('MRSM')) return { bg: '#fff7ed', text: '#c2410c', border: '#ffedd5' };
    if (category.includes('SBP')) return { bg: '#f0f9ff', text: '#0369a1', border: '#e0f2fe' };
    if (category.includes('SM')) return { bg: '#f5f3ff', text: '#6d28d9', border: '#ede9fe' };
    return { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search school name or S/N..."
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

      {boardingSchoolsSelection === undefined ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={filteredSchools}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const theme = getCategoryTheme(item.category);
            return (
              <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('UniversityDetail', { id: item._id, type: 'Boarding' })}
                activeOpacity={0.7}
              >
                <View style={[styles.accentLine, { backgroundColor: theme.text }]} />
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                    <Text style={[styles.badgeText, { color: theme.text }]}>
                      {item.category}
                    </Text>
                  </View>
                  <View style={styles.stateBadge}>
                    <Feather name="map-pin" size={12} color="#64748b" />
                    <Text style={styles.stateText}>{item.state}</Text>
                  </View>
                </View>

                <Text style={styles.schoolName}>{item.name}</Text>
                
                <View style={styles.managedRow}>
                  <Feather name="shield" size={14} color="#94a3b8" />
                  <Text style={styles.managedText}>Managed by {item.managedBy}</Text>
                </View>

                <View style={styles.footer}>
                  <View style={styles.tags}>
                    {item.entryLevels.map((lvl: string) => (
                      <View key={lvl} style={styles.tag}>
                        <Text style={styles.tagText}>{lvl}</Text>
                      </View>
                    ))}
                    <View style={styles.genderTag}>
                      <Feather 
                        name={item.gender === 'mixed' ? 'users' : item.gender === 'male' ? 'user' : 'user'} 
                        size={12} 
                        color="#64748b" 
                      />
                      <Text style={styles.tagText}>{item.gender}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={20} color="#cbd5e1" />
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="book-open" size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Schools Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filters to find boarding schools.</Text>
            </View>
          }
        />
      )}

      <BoardingSchoolFilterModal 
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
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  stateBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stateText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  schoolName: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 4, lineHeight: 24 },
  managedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  managedText: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tag: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  genderTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 12, color: '#64748b', fontWeight: '500', textTransform: 'capitalize' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },
});
