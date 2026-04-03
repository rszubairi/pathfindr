import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, changeLanguage } from '../lib/i18n';
import { useTheme } from '../theme';
import { Feather } from '@expo/vector-icons';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

export function LanguageSwitcher({ variant = 'dark' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const currentLang = i18n.language;
  
  const currentLangData = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
  const isLight = variant === 'light';

  const handleSelect = async (code: string) => {
    await changeLanguage(code);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.trigger,
          isLight ? styles.triggerLight : { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: colors.border }
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Feather name="globe" size={16} color={isLight ? '#ffffff' : colors.text} />
        <Text style={[styles.triggerText, isLight ? { color: '#ffffff' } : { color: colors.text }]}>
          {currentLangData.label}
        </Text>
        <Feather name="chevron-down" size={14} color={isLight ? 'rgba(255,255,255,0.7)' : colors.textMuted} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalBackdrop} 
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('mobile.common.language', 'Select Language')}
              </Text>
            </View>
            
            <View style={styles.optionsContainer}>
              {LANGUAGES.map((lang) => {
                const isActive = currentLang === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.optionItem,
                      { borderBottomColor: colors.border }
                    ]}
                    onPress={() => handleSelect(lang.code)}
                  >
                    <View style={styles.optionInfo}>
                      <Text style={[styles.optionLabel, { color: colors.text }]}>
                        {lang.name}
                      </Text>
                      <Text style={[styles.optionCode, { color: colors.textMuted }]}>
                        {lang.label}
                      </Text>
                    </View>
                    {isActive && (
                      <Feather name="check" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.border }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, { color: colors.text }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  triggerLight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionCode: {
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
