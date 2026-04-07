'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { PricingCard } from '@/components/subscription/PricingCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '@/hooks/useSubscription';
import { TIER_CONFIG, type TierKey } from '@/lib/stripe';
import type { Id } from '@convex/_generated/dataModel';
import { Gift } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { tier: currentTier } = useSubscription();
  const createCheckout = useAction(api.xenditActions.createCheckoutSession);
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);

  // Also read userId directly from localStorage as fallback for the Convex query
  const storedUserId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const handleSelect = async (tier: TierKey) => {
    setError(null);

    // If auth is still loading, wait — don't silently fail
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push(`/register?redirect=/pricing`);
      return;
    }

    // Use Convex user._id if available, otherwise fall back to localStorage userId
    const userId = user?._id ?? storedUserId;
    if (!userId) return;

    setLoadingTier(tier);
    try {
      const { sessionUrl } = await createCheckout({
        userId: userId as Id<'users'>,
        tier,
      });
      window.location.href = sessionUrl;
    } catch (err) {
      console.error('Failed to create checkout session:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to start checkout. Please try again.'
      );
      setLoadingTier(null);
    }
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {t('pricing.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('pricing.subtitle')}
            </p>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <Container size="lg">
          {error && (
            <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {(Object.entries(TIER_CONFIG) as [TierKey, (typeof TIER_CONFIG)[TierKey]][]).map(
              ([key, config]) => (
                <PricingCard
                  key={key}
                  tier={key}
                  name={config.name}
                  price={config.price}
                  originalPrice={'originalPrice' in config ? config.originalPrice : undefined}
                  currency={config.currency}
                  interval={config.interval}
                  features={config.features}
                  applicationsLimit={config.applicationsLimit}
                  isCurrentPlan={currentTier === key}
                  isPopular={'popular' in config && config.popular === true}
                  onSelect={() => handleSelect(key)}
                  isLoading={loadingTier === key}
                />
              )
            )}
          </div>

          {/* Coupon Code Input */}
          <div className="max-w-md mx-auto mt-10 text-center">
            {!showCoupon ? (
              <button
                onClick={() => setShowCoupon(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 mx-auto"
              >
                <Gift className="w-4 h-4" />
                Have a sponsor code?
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    if (couponInput.trim()) {
                      router.push(`/claim/${couponInput.trim()}`);
                    }
                  }}
                  disabled={!couponInput.trim()}
                >
                  Redeem
                </Button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* FAQ / Info */}
      <section className="py-16 bg-gray-50">
        <Container size="lg">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {t('pricing.faq.title')}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('pricing.faq.q1.q')}
                </h3>
                <p className="text-gray-600">
                  {t('pricing.faq.q1.a')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('pricing.faq.q2.q')}
                </h3>
                <p className="text-gray-600">
                  {t('pricing.faq.q2.a')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('pricing.faq.q3.q')}
                </h3>
                <p className="text-gray-600">
                  {t('pricing.faq.q3.a')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('pricing.faq.q4.q')}
                </h3>
                <p className="text-gray-600">
                  {t('pricing.faq.q4.a')}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
