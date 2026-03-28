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
import { useTheme, ThemeColors } from '../theme';

export function InternshipsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const { user } = useSelector((state: RootState) => state.auth);
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
      default: return { bg: colors.background, text: colors.textMuted, border: colors.border };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color={colors.placeholderText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search roles or companies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.placeholderText}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, Object.keys(filters).length > 0 && styles.activeFilterBtn]}
          onPress={() => setIsFilterVisible(true)}
        >
          <Feather name="sliders" size={20} color={Object.keys(filters).length > 0 ? '#fff' : colors.textMuted} />
        </TouchableOpacity>
      </View>

      {internships === undefined ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
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
                    <Feather name="map-pin" size={12} color={colors.textMuted} />
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                </View>

                <View style={styles.companyRow}>
                  {isPrivate && <Feather name="lock" size={14} color={colors.placeholderText} style={{ marginRight: 4 }} />}
                  <Text style={[styles.companyName, isPrivate && styles.privateText]}>
                    {item.companyName}
                  </Text>
                </View>

                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

                <View style={styles.footer}>
                  <View style={styles.footerInfo}>
                    <Feather name="calendar" size={14} color={colors.placeholderText} />
                    <Text style={styles.footerText}>
                      Apply by {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={colors.border} />
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="briefcase" size={48} color={colors.border} />
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 15, color: colors.text },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
  locationText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  companyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  companyName: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  privateText: { color: colors.placeholderText, fontStyle: 'italic' },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16, lineHeight: 24 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 12 },
  footerInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 12, color: colors.placeholderText, fontWeight: '500' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
});
