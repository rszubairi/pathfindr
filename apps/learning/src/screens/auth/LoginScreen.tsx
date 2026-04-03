import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAction } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../store/slices/authSlice';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';
import { useTheme, ThemeColors } from '../../theme';

const { width } = Dimensions.get('window');

export function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = useAction(api.authActions.loginUser);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    try {
      setIsLoading(true);
      const result = await loginUser({ email: email.toLowerCase(), password });

      await SecureStore.setItemAsync('token', result.token);
      await SecureStore.setItemAsync('userId', result.user._id);

      dispatch(setToken(result.token));
      dispatch(
        setUser({
          id: result.user._id,
          email: result.user.email,
          fullName: result.user.fullName,
          role: result.user.role,
        })
      );
    } catch (error: any) {
      const raw: string = error.message || '';
      const extracted = raw.includes('Uncaught Error:')
        ? raw.split('Uncaught Error:').pop()?.trim()
        : raw;
      Alert.alert('Login Failed', extracted || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerSection}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={[styles.logo, colors.logoTint ? { tintColor: colors.logoTint } : {}]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>{t('mobile.auth.welcomeBack')}</Text>
          <Text style={styles.subtitle}>{t('mobile.auth.signInSubtitle')}</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('mobile.auth.email')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('mobile.auth.emailPlaceholder')}
                  placeholderTextColor={colors.placeholderText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('mobile.auth.password')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('mobile.auth.passwordPlaceholder')}
                  placeholderTextColor={colors.placeholderText}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>{t('mobile.auth.forgotPassword')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? t('mobile.auth.signingIn') : t('mobile.auth.signIn')}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{t('mobile.auth.noAccount')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                <Text style={styles.footerLink}>{t('mobile.auth.signUp')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 20,
  },
  logo: {
    width: width * 0.45,
    height: width * 0.35,
  },
  formSection: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    gap: 18,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  inputWrapper: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.inputText,
  },
  forgotPassword: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
