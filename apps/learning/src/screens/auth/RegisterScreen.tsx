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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAction, useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useTranslation } from 'react-i18next';
import { useTheme, ThemeColors } from '../../theme';

export function RegisterScreen() {
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Support a referral code passed as a route param (e.g. from a deep link)
  const routeRefCode: string | undefined = route.params?.refCode;

  const referralValidation = useQuery(
    api.referrals.validateReferralCode,
    routeRefCode ? { referralCode: routeRefCode } : 'skip'
  );

  const registerUser = useAction(api.authActions.registerUser);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const resolvedRefCode = routeRefCode || (referralCode.trim() || undefined);
      await registerUser({
        fullName,
        email: email.toLowerCase(),
        password,
        phone: '',
        referredByCode: resolvedRefCode,
      });
      Alert.alert('Success', 'Account created! Please sign in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login' as never) }
      ]);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('mobile.auth.createAccount')}</Text>
          <Text style={styles.subtitle}>{t('mobile.auth.createAccountSubtitle')}</Text>

          {/* Referral banner — shown when arriving via a referral link */}
          {routeRefCode && referralValidation?.valid && (
            <View style={styles.referralBanner}>
              <Text style={styles.referralBannerText}>
                Referred by <Text style={styles.referralBannerName}>{referralValidation.referrerName}</Text>!{' '}
                Your registration will count toward their referral rewards.
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('mobile.auth.fullName')}</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder={t('mobile.auth.fullNamePlaceholder')}
                placeholderTextColor={colors.placeholderText}
                autoComplete="name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('mobile.auth.email')}</Text>
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('mobile.auth.password')}</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.placeholderText}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('mobile.auth.confirmPassword')}</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.placeholderText}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            {/* Only show the manual input when no referral code was passed via route */}
            {!routeRefCode && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Referral Code (optional)</Text>
                <TextInput
                  style={styles.input}
                  value={referralCode}
                  onChangeText={setReferralCode}
                  placeholder="Enter a friend's referral code"
                  placeholderTextColor={colors.placeholderText}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
            )}

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
              <Text style={styles.registerButtonText}>
                {isLoading ? t('mobile.auth.creating') : t('mobile.auth.createAccount')}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{t('mobile.auth.haveAccount')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                <Text style={styles.footerLink}>{t('mobile.auth.signIn')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.terms}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.inputText,
  },
  registerButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  terms: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  referralBanner: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  referralBannerText: {
    fontSize: 13,
    color: '#166534',
    textAlign: 'center',
    lineHeight: 20,
  },
  referralBannerName: {
    fontWeight: '700',
  },
});
