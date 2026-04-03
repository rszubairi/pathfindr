import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../convex/_generated/api';
import { Feather } from '@expo/vector-icons';
import { BoardingSchoolFilterModal } from '../components/BoardingSchoolFilterModal';
import { useTheme, ThemeColors } from '../theme';

export function BoardingSchoolsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);

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
    return { bg: colors.background, text: colors.textSecondary, border: colors.border };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color={colors.placeholderText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('mobile.boardingSchools.searchPlaceholder')}
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

      {boardingSchoolsSelection === undefined ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
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
                    <Feather name="map-pin" size={12} color={colors.textMuted} />
                    <Text style={styles.stateText}>{item.state}</Text>
                  </View>
                </View>

                <Text style={styles.schoolName}>{item.name}</Text>

                <View style={styles.managedRow}>
                  <Feather name="shield" size={14} color={colors.placeholderText} />
                  <Text style={styles.managedText}>{t('mobile.boardingSchools.managedBy', { provider: item.managedBy })}</Text>
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
                        color={colors.textMuted}
                      />
                      <Text style={styles.tagText}>{item.gender}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={20} color={colors.border} />
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="book-open" size={48} color={colors.border} />
              <Text style={styles.emptyTitle}>{t('mobile.boardingSchools.noSchools')}</Text>
              <Text style={styles.emptySubtitle}>{t('mobile.boardingSchools.tryAdjusting')}</Text>
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
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 15, color: colors.text },
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
  stateBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stateText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  schoolName: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4, lineHeight: 24 },
  managedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  managedText: { fontSize: 12, color: colors.placeholderText, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 12 },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tag: { backgroundColor: colors.borderLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  genderTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.borderLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 12, color: colors.textMuted, fontWeight: '500', textTransform: 'capitalize' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
});
