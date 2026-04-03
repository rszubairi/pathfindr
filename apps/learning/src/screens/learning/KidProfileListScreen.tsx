import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useTheme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProfile } from '../../store/slices/kidProfilesSlice';
import { RootState } from '../../store';
import { Id } from '../../../../../convex/_generated/dataModel';

export function KidProfileListScreen() {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    // Get profiles from Convex
    const profiles = useQuery(
        api.kidProfiles.getKidProfiles,
        user?.id ? { userId: user.id as Id<'users'> } : 'skip'
    );

    const handleSelectProfile = (profile: any) => {
        dispatch(setSelectedProfile(profile));
        navigation.navigate('Dashboard');
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
                    {item.grade} • Birth: {item.dateOfBirth}
                </Text>
            </View>
            <TouchableOpacity 
                onPress={() => navigation.navigate('KidProfileSetup', { kidId: item._id })}
                style={styles.editButton}
            >
                <Feather name="edit-2" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Who's Learning?</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Select a profile to start tracking progress
                </Text>
            </View>

            <FlatList
                data={profiles}
                renderItem={renderProfileItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <TouchableOpacity 
                        style={[styles.addButton, { borderColor: colors.primary, borderStyle: 'dashed' }]}
                        onPress={() => navigation.navigate('KidProfileSetup')}
                    >
                        <Feather name="plus-circle" size={24} color={colors.primary} />
                        <Text style={[styles.addButtonText, { color: colors.primary }]}>Add New Kid</Text>
                    </TouchableOpacity>
                }
                ListEmptyComponent={
                    !profiles ? (
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Loading profiles...</Text>
                    ) : (
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No profiles found. Add one to get started!</Text>
                    )
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
    },
    listContent: {
        padding: 16,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileInfo: {
        fontSize: 14,
        marginTop: 2,
    },
    editButton: {
        padding: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
        marginBottom: 20,
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
});

export default KidProfileListScreen;
