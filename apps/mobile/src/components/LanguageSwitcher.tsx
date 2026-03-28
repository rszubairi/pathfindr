import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, changeLanguage } from '../lib/i18n';
import { useTheme } from '../theme';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

export function LanguageSwitcher({ variant = 'dark' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const { colors } = useTheme();
  const currentLang = i18n.language;

  const isLight = variant === 'light';

  return (
    <View style={styles.container}>
      {LANGUAGES.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.button,
              isActive && (isLight ? styles.buttonActiveLight : { backgroundColor: colors.primary, borderColor: colors.primary }),
              !isActive && (isLight ? styles.buttonInactiveLight : { backgroundColor: 'transparent', borderColor: colors.border }),
            ]}
            onPress={() => changeLanguage(lang.code)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.label,
                isActive && (isLight ? styles.labelActiveLight : { color: '#ffffff' }),
                !isActive && (isLight ? styles.labelInactiveLight : { color: colors.textMuted }),
              ]}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  buttonActiveLight: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  buttonInactiveLight: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  labelActiveLight: {
    color: '#2563eb',
  },
  labelInactiveLight: {
    color: 'rgba(255,255,255,0.8)',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
