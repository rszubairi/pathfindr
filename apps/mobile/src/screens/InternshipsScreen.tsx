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
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { InternshipFilterModal } from '../components/InternshipFilterModal';
import type { Id } from '../../../../convex/_generated/dataModel';

export function InternshipsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const { user } = useSelector((state: RootState) => state.auth);
  
  const internships = useQuery(api.internships.listActive, { 
    userId: user?.id as Id<'users'> | undefined,
    ...filters
  });

  const filteredInternships = internships?.filter((item: any) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'part-time': return { bg: '#fdf4ff', text: '#a21caf', border: '#f5d0fe' };
      case 'remote': return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      default: return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search roles or companies..."
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

      {internships === undefined ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={filteredInternships}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const typeStyle = getJobTypeColor(item.type);
            const isPrivate = item.companyName === 'Private Company';

            return (
              <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('InternshipDetail', { id: item._id })}
                activeOpacity={0.7}
              >
                <View style={[styles.accentLine, { backgroundColor: typeStyle.text }]} />
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: typeStyle.bg, borderColor: typeStyle.border }]}>
                    <Text style={[styles.badgeText, { color: typeStyle.text }]}>
                      {item.type.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.deadlineBadge}>
                    <Feather name="map-pin" size={12} color="#64748b" />
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                </View>

                <View style={styles.companyRow}>
                  {isPrivate && <Feather name="lock" size={14} color="#94a3b8" style={{ marginRight: 4 }} />}
                  <Text style={[styles.companyName, isPrivate && styles.privateText]}>
                    {item.companyName}
                  </Text>
                </View>
                
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

                <View style={styles.footer}>
                  <View style={styles.footerInfo}>
                    <Feather name="calendar" size={14} color="#94a3b8" />
                    <Text style={styles.footerText}>
                      Apply by {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#cbd5e1" />
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="briefcase" size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No Internships Found</Text>
              <Text style={styles.emptySubtitle}>We couldn't find any active internships matching your search.</Text>
            </View>
          }
        />
      )}

      <InternshipFilterModal 
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
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 15, color: '#1e293b' },
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
  locationText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  companyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  companyName: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  privateText: { color: '#94a3b8', fontStyle: 'italic' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 16, lineHeight: 24 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  footerInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },
});
