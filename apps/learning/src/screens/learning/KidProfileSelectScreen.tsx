import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useTheme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProfile } from '../../store/slices/kidProfilesSlice';
import { RootState } from '../../store';
import { Id } from '../../../../../convex/_generated/dataModel';
import { RootStackParamList } from '../../navigation/RootNavigator';

type KidProfileSelectRouteProp = RouteProp<RootStackParamList, 'KidProfileSelect'>;

export function KidProfileSelectScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<KidProfileSelectRouteProp>();
    const { courseId } = route.params;
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const profiles = useQuery(
        api.kidProfiles.getKidProfiles,
        user?.id ? { userId: user.id as Id<'users'> } : 'skip'
    );

    const handleSelectProfile = (profile: any) => {
        dispatch(setSelectedProfile(profile));
        navigation.navigate('CourseDetail', { courseId, autoEnroll: true });
    };

    const renderProfileItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.profileCard, { backgroundColor: colors.surface }]}
            onPress={() => handleSelectProfile(item)}
        >
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
                {item.avatarUrl ? (
                    <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                ) : (
                    <Feather name="user" size={32} color={colors.primary} />
                )}
            </View>
            <View style={styles.profileDetails}>
                <Text style={[styles.profileName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.profileInfo, { color: colors.textSecondary }]}>
                    {item.grade} • Born {item.dateOfBirth}
                </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Who's Learning?</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Pick a profile to continue to the course
                </Text>
            </View>

            <FlatList
                data={profiles}
                renderItem={renderProfileItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <TouchableOpacity
                        style={[styles.addButton, { borderColor: colors.primary }]}
                        onPress={() => navigation.navigate('KidProfileSetup')}
                    >
                        <Feather name="plus-circle" size={20} color={colors.primary} />
                        <Text style={[styles.addButtonText, { color: colors.primary }]}>Add New Kid</Text>
                    </TouchableOpacity>
                }
                ListEmptyComponent={
                    !profiles ? (
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Loading profiles...</Text>
                    ) : (
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No profiles yet. Add one above to get started.</Text>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, paddingBottom: 8 },
    title: { fontSize: 24, fontWeight: '800' },
    subtitle: { fontSize: 15, marginTop: 4 },
    listContent: { padding: 16 },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatar: { width: 56, height: 56, borderRadius: 28 },
    profileDetails: { flex: 1 },
    profileName: { fontSize: 17, fontWeight: '700' },
    profileInfo: { fontSize: 13, marginTop: 2 },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        marginBottom: 16,
        gap: 8,
    },
    addButtonText: { fontSize: 15, fontWeight: '600' },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 15 },
});
