'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Container } from '@/components/ui/Container';
import { PricingCard } from '@/components/subscription/PricingCard';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '@/hooks/useSubscription';
import { TIER_CONFIG, type TierKey } from '@/lib/stripe';
import type { Id } from '../../../../../convex/_generated/dataModel';

export function PricingSection() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { tier: currentTier } = useSubscription();
  const createCheckout = useAction(api.stripeActions.createCheckoutSession);
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const storedUserId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const handleSelect = async (tier: TierKey) => {
    setError(null);
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push(`/register?redirect=/`);
      return;
    }

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
    <section id="pricing" className="py-24 bg-gray-50 border-t border-gray-100">
      <Container size="lg">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('pricing.subtitle')}
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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

        {/* FAQ Preview or Small Info */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">{t('pricing.faq.q1.q')}</h3>
              <p className="text-sm text-gray-600">{t('pricing.faq.q1.a')}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">{t('pricing.faq.q2.q')}</h3>
              <p className="text-sm text-gray-600">{t('pricing.faq.q2.a')}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
