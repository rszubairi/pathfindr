import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useMutation, useQuery } from 'convex/react';
import { useSelector } from 'react-redux';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useTheme } from '../../theme';
import { RootState } from '../../store';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { Feather } from '@expo/vector-icons';

type KidProfileSetupRouteProp = RouteProp<RootStackParamList, 'KidProfileSetup'>;

export function KidProfileSetupScreen() {
    const route = useRoute<KidProfileSetupRouteProp>();
    const navigation = useNavigation();
    const { colors } = useTheme();
    const { kidId } = route.params || {};
    const { user } = useSelector((state: RootState) => state.auth);

    // Convex Mutations and Queries
    const createProfile = useMutation(api.kidProfiles.createKidProfile);
    const updateProfile = useMutation(api.kidProfiles.updateKidProfile);
    const existingProfile = useQuery(api.kidProfiles.getKidProfileById,
        kidId && user?.id ? { kidProfileId: kidId as Id<'kidProfiles'>, userId: user.id as Id<'users'> } : 'skip'
    );

    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [grade, setGrade] = useState('');
    const [learningGoals, setLearningGoals] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (existingProfile) {
            setName(existingProfile.name);
            setDateOfBirth(existingProfile.dateOfBirth);
            setGrade(existingProfile.grade);
            setLearningGoals(existingProfile.learningGoals?.join(', ') || '');
        }
    }, [existingProfile]);

    const handleSave = async () => {
        if (!name || !dateOfBirth || !grade) {
            Alert.alert('Missing Info', 'Please fill in all required fields.');
            return;
        }

        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to save a profile.');
            return;
        }

        setIsSaving(true);
        try {
            const goalsArray = learningGoals.split(',').map((g) => g.trim()).filter(Boolean);

            if (kidId) {
                await updateProfile({
                    kidProfileId: kidId as Id<'kidProfiles'>,
                    userId: user.id as Id<'users'>,
                    name,
                    dateOfBirth,
                    grade,
                    learningGoals: goalsArray,
                });
            } else {
                await createProfile({
                    userId: user.id as Id<'users'>,
                    name,
                    dateOfBirth,
                    grade,
                    learningGoals: goalsArray,
                });
            }
            navigation.goBack();
        } catch (error: any) {
            const raw: string = error.message || '';
            const extracted = raw.includes('Uncaught Error:')
                ? raw.split('Uncaught Error:').pop()?.trim()
                : raw;
            Alert.alert('Error', extracted || 'Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (kidId && !existingProfile) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.label, { color: colors.text }]}>Child's Name</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                        placeholder="Enter name"
                        placeholderTextColor={colors.placeholderText}
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={[styles.label, { color: colors.text }]}>Date of Birth</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={colors.placeholderText}
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
                    />

                    <Text style={[styles.label, { color: colors.text }]}>Grade Level</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                        placeholder="e.g., 3rd Grade, Year 4"
                        placeholderTextColor={colors.placeholderText}
                        value={grade}
                        onChangeText={setGrade}
                    />

                    <Text style={[styles.label, { color: colors.text }]}>Learning Goals (comma separated)</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                        placeholder="e.g., Improve reading, Learn math basics"
                        placeholderTextColor={colors.placeholderText}
                        value={learningGoals}
                        onChangeText={setLearningGoals}
                        multiline
                    />
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.surface }]}>
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: colors.primary, opacity: isSaving ? 0.7 : 1 }]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.saveButtonText}>{kidId ? 'Update Profile' : 'Save Profile'}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    formCard: {
        padding: 20,
        borderRadius: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
        fontSize: 16,
    },
    footer: {
        padding: 16,
    },
    saveButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default KidProfileSetupScreen;