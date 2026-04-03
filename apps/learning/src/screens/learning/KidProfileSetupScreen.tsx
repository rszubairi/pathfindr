import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addProfile, updateProfile, setSelectedProfile } from '../../store/slices/kidProfilesSlice';
import { useTheme } from '../../theme';
import { RootStackParamList } from '../../navigation/RootNavigator';

type KidProfileSetupRouteProp = RouteProp<RootStackParamList, 'KidProfileSetup'>;

export function KidProfileSetupScreen() {
    const route = useRoute<KidProfileSetupRouteProp>();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { kidId } = route.params || {};

    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [grade, setGrade] = useState('');
    const [learningGoals, setLearningGoals] = useState('');

    const handleSave = () => {
        const profileData = {
            id: kidId || `kid_${Date.now()}`,
            userId: 'user_1', // Will come from auth state
            name,
            dateOfBirth,
            grade,
            learningGoals: learningGoals.split(',').map((g) => g.trim()).filter(Boolean),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (kidId) {
            dispatch(updateProfile(profileData));
        } else {
            dispatch(addProfile(profileData));
            dispatch(setSelectedProfile(profileData));
        }

        navigation.goBack();
    };

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
                    style={[styles.saveButton, { backgroundColor: colors.primary }]}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Save Profile</Text>
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
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default KidProfileSetupScreen;