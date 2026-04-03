import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { useTheme, ThemeColors } from '../../theme';

export function PersonalDetailsForm({ data, onUpdate, user }: any) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [formData, setFormData] = useState(data.personalDetails || {});
  const [uploading, setUploading] = useState(false);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveProfileImage = useMutation(api.storage.saveProfileImage);

  const handleChange = (key: string, value: string) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onUpdate({ personalDetails: updated });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setLocalImageUri(uri);
      setUploading(true);
      try {
        const response = await fetch(uri);
        const blob = await response.blob();

        // Ensure valid content type - blob.type can be empty in React Native
        const contentType = blob.type || result.assets[0].mimeType || 'image/jpeg';

        const uploadUrl = await generateUploadUrl();
        const uploadResult = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': contentType },
          body: blob,
        });

        if (!uploadResult.ok) {
          throw new Error(`Upload failed with status ${uploadResult.status}`);
        }

        const { storageId } = await uploadResult.json();
        if (!storageId) {
          throw new Error('No storageId returned from upload');
        }

        await saveProfileImage({
          userId: (user._id || user.id) as Id<'users'>,
          storageId,
        });
      } catch (error) {
        console.error('Image upload failed:', error);
        setLocalImageUri(null);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageSection}>
        <TouchableOpacity onPress={pickImage} disabled={uploading} style={styles.avatarContainer}>
          {localImageUri || user?.profileImageUrl ? (
            <Image source={{ uri: localImageUri || user.profileImageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Feather name="camera" size={32} color={colors.textMuted} />
            </View>
          )}
          {uploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.imageHint}>Tap to change profile picture</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={formData.dateOfBirth}
          onChangeText={(v) => handleChange('dateOfBirth', v)}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.placeholderText}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.tagSelector}>
          {['male', 'female', 'other'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.tag, formData.gender === g && styles.activeTag]}
              onPress={() => handleChange('gender', g)}
            >
              <Text style={[styles.tagText, formData.gender === g && styles.activeTagText]}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nationality</Text>
        <TextInput
          style={styles.input}
          value={formData.nationality}
          onChangeText={(v) => handleChange('nationality', v)}
          placeholder="e.g. Malaysian"
          placeholderTextColor={colors.placeholderText}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Country of Residence</Text>
        <TextInput
          style={styles.input}
          value={formData.country}
          onChangeText={(v) => handleChange('country', v)}
          placeholder="e.g. Malaysia"
          placeholderTextColor={colors.placeholderText}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneRow}>
          <TextInput
            style={[styles.input, { width: 80, marginRight: 10 }]}
            value={formData.countryCode}
            onChangeText={(v) => handleChange('countryCode', v)}
            placeholder="+60"
            placeholderTextColor={colors.placeholderText}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={formData.phone}
            onChangeText={(v) => handleChange('phone', v)}
            placeholder="123456789"
            placeholderTextColor={colors.placeholderText}
            keyboardType="phone-pad"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { padding: 16 },
  imageSection: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, overflow: 'hidden', backgroundColor: colors.borderLight },
  avatar: { width: 100, height: 100 },
  placeholderAvatar: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  imageHint: { marginTop: 8, fontSize: 12, color: colors.textMuted },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 12, padding: 12, fontSize: 16, color: colors.inputText },
  tagSelector: { flexDirection: 'row', gap: 10 },
  tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.borderLight, borderWidth: 1, borderColor: colors.border },
  activeTag: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  tagText: { color: colors.textMuted, fontWeight: '500' },
  activeTagText: { color: colors.primary, fontWeight: '700' },
  phoneRow: { flexDirection: 'row' },
});
