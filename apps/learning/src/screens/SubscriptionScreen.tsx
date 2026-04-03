import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Feather } from '@expo/vector-icons';
import { useTheme, ThemeColors } from '../theme';

const TIER_CONFIG = {
  pro: {
    name: 'Pro',
    price: 9.99,
    originalPrice: 25,
    currency: 'USD',
    interval: 'year',
    features: [
      'Apply to 5 scholarships per year',
      'Full scholarship details & eligibility',
      'Application tracking dashboard',
      'Email notifications for deadlines',
    ],
  },
  expert: {
    name: 'Expert',
    price: 49.99,
    currency: 'USD',
    interval: 'year',
    features: [
      'Apply to 20 scholarships per year',
      'Full scholarship details & eligibility',
      'Application tracking dashboard',
      'Email notifications for deadlines',
      'Priority support',
      'Scholarship match recommendations',
    ],
    popular: true,
  },
};

export function SubscriptionScreen({ navigation }: any) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  // @ts-ignore
  const createCheckoutSession = useAction(api.stripeActions.createCheckoutSession);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: 'pro' | 'expert') => {
    if (!isAuthenticated || !user) {
      Alert.alert('Authentication required', 'Please log in to subscribe.');
      navigation.navigate('Login');
      return;
    }

    try {
      setLoading(tier);
      const res = await createCheckoutSession({
        userId: user.id as any,
        tier,
      });
      if (res && res.sessionUrl) {
        Linking.openURL(res.sessionUrl);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Simple, transparent pricing</Text>
      <Text style={styles.subtitle}>Choose the plan that matches your scholarship goals.</Text>

      {/* Pro Plan */}
      <View style={styles.tierBox}>
        <View style={styles.tierHeader}>
          <Text style={styles.tierTitle}>{TIER_CONFIG.pro.name}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>${TIER_CONFIG.pro.originalPrice}</Text>
          <Text style={styles.tierPrice}>${TIER_CONFIG.pro.price}</Text>
          <Text style={styles.tierInterval}> /{TIER_CONFIG.pro.interval}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.featuresList}>
          {TIER_CONFIG.pro.features.map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Feather name="check-circle" size={18} color={colors.primary} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.subscribeBtn}
          disabled={loading !== null}
          onPress={() => handleSubscribe('pro')}
        >
          {loading === 'pro' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.subscribeBtnText}>Get Started with Pro</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Expert Plan */}
      <View style={[styles.tierBox, styles.popularTierBox]}>
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>Most Popular</Text>
        </View>
        <View style={styles.tierHeader}>
          <Text style={styles.tierTitle}>{TIER_CONFIG.expert.name}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.tierPrice}>${TIER_CONFIG.expert.price}</Text>
          <Text style={styles.tierInterval}> /{TIER_CONFIG.expert.interval}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.featuresList}>
          {TIER_CONFIG.expert.features.map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Feather name="check-circle" size={18} color={colors.primary} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.subscribeBtn, styles.subscribeExpertBtn]}
          disabled={loading !== null}
          onPress={() => handleSubscribe('expert')}
        >
          {loading === 'expert' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.subscribeBtnText}>Get Started with Expert</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginBottom: 32, lineHeight: 24, paddingHorizontal: 16 },
  tierBox: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative'
  },
  popularTierBox: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    zIndex: 1,
  },
  popularBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tierHeader: { marginBottom: 16 },
  tierTitle: { fontSize: 22, fontWeight: '700', color: colors.text },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  originalPrice: { fontSize: 18, color: colors.placeholderText, textDecorationLine: 'line-through', marginRight: 8 },
  tierPrice: { fontSize: 36, fontWeight: 'bold', color: colors.text },
  tierInterval: { fontSize: 16, color: colors.textMuted, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 20 },
  featuresList: { gap: 12, marginBottom: 24 },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  featureText: { fontSize: 15, color: colors.textSecondary, flex: 1, lineHeight: 22 },
  subscribeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeExpertBtn: {
    backgroundColor: '#1e40af',
  },
  subscribeBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
