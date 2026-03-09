'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { PricingCard } from '@/components/subscription/PricingCard';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { TIER_CONFIG, type TierKey } from '@/lib/stripe';
import type { Id } from '../../../../../convex/_generated/dataModel';

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { tier: currentTier } = useSubscription();
  const createCheckout = useAction(api.stripeActions.createCheckoutSession);
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);

  const handleSelect = async (tier: TierKey) => {
    if (!isAuthenticated) {
      router.push(`/register?redirect=/pricing`);
      return;
    }

    if (!user) return;

    setLoadingTier(tier);
    try {
      const { sessionUrl } = await createCheckout({
        userId: user._id as Id<'users'>,
        tier,
      });
      window.location.href = sessionUrl;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
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
              Choose your plan
            </h1>
            <p className="text-lg text-gray-600">
              Subscribe to start applying for scholarships. Pick the plan that
              fits your needs and unlock your path to educational opportunities.
            </p>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <Container size="lg">
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {(Object.entries(TIER_CONFIG) as [TierKey, (typeof TIER_CONFIG)[TierKey]][]).map(
              ([key, config]) => (
                <PricingCard
                  key={key}
                  tier={key}
                  name={config.name}
                  price={config.price}
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
        </Container>
      </section>

      {/* FAQ / Info */}
      <section className="py-16 bg-gray-50">
        <Container size="lg">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What counts as an application?
                </h3>
                <p className="text-gray-600">
                  Each time you click &quot;Apply Now&quot; on a scholarship and
                  are redirected to the scholarship provider&apos;s application
                  page, it counts as one application.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  When does my application limit reset?
                </h3>
                <p className="text-gray-600">
                  Your application count resets annually when your subscription
                  renews.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I upgrade my plan?
                </h3>
                <p className="text-gray-600">
                  Yes! You can upgrade from Pro to Expert at any time. The price
                  difference will be prorated for the remainder of your billing
                  period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600">
                  Absolutely. You can cancel your subscription at any time from
                  your account settings. You&apos;ll continue to have access
                  until the end of your current billing period.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
