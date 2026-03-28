import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        {/* Language Switcher */}
        <View style={styles.languageRow}>
          <LanguageSwitcher />
        </View>

        <Text style={styles.title}>Pathfindr</Text>
        <Text style={styles.subtitle}>
          {t('mobile.home.subtitle')}
        </Text>
        <Text style={styles.description}>
          {t('mobile.home.description')}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>{t('nav.getStarted')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>{t('nav.signIn')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>{t('mobile.home.whatWeOffer')}</Text>

        <View style={styles.featuresGrid}>
          <FeatureCard
            title={t('nav.scholarships')}
            description={t('mobile.home.scholarshipsDesc')}
            icon="award"
            imageSource={require('../../assets/images/female-student-studying-at-college-library-2023-11-27-04-50-27-utc.webp')}
            onPress={() => navigation.navigate('Scholarships' as never)}
          />
          <FeatureCard
            title={t('nav.internships')}
            description={t('mobile.home.internshipsDesc')}
            icon="briefcase"
            imageSource={require('../../assets/images/islamic-girl-sitting-and-using-laptop-2023-11-27-05-21-11-utc.webp')}
            onPress={() => navigation.navigate('Internships' as never)}
          />
          <FeatureCard
            title={t('nav.boardingschools')}
            description={t('mobile.home.boardingSchoolsDesc')}
            icon="home"
            imageSource={require('../../assets/images/pretty-girl-using-laptop-on-background-of-her-clas-2023-11-27-05-22-09-utc.webp')}
            onPress={() => navigation.navigate('BoardingSchools' as never)}
          />
          <FeatureCard
            title={t('nav.internationalschools')}
            description={t('mobile.home.internationalSchoolsDesc')}
            icon="globe"
            imageSource={require('../../assets/images/female-student-studying-at-college-library-2023-11-27-04-50-27-utc.webp')}
            onPress={() => navigation.navigate('InternationalSchools' as never)}
          />
        </View>
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>{t('home.cta.title')}</Text>
        <Text style={styles.ctaDescription}>
          {t('home.cta.subtitle')}
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.ctaButtonText}>{t('home.cta.createAccount')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  imageSource,
  onPress,
}: {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  imageSource: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
      <Image source={imageSource} style={styles.cardCoverImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderWrapper}>
          <View style={styles.iconContainer}>
            <Feather name={icon} size={28} color="#2563eb" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  hero: {
    paddingHorizontal: 24,
    paddingVertical: 60,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  languageRow: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 32,
    textAlign: 'center',
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardCoverImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#cbd5e1',
  },
  cardContent: {
    padding: 20,
  },
  cardHeaderWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    backgroundColor: '#eff6ff',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: '#dbeafe',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: '600',
  },
});
