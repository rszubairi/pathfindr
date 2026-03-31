'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/Modal';
import { PricingCard } from './PricingCard';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { TIER_CONFIG, type TierKey } from '@/lib/stripe';
import type { Id } from '@convex/_generated/dataModel';
import { AlertCircle, Gift } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  title = "Research Subscription Required",
  description = "You need an active annual subscription to apply for internships and access premium features."
}: SubscriptionModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { tier: currentTier } = useSubscription();
  const createCheckout = useAction(api.stripeActions.createCheckoutSession);
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState('');

  const handleSelect = async (tier: TierKey) => {
    if (!isAuthenticated) {
      router.push(`/register?redirect=${window.location.pathname}`);
      return;
    }

    if (!user?._id) return;

    setLoadingTier(tier);
    setError(null);
    try {
      const { sessionUrl } = await createCheckout({
        userId: user._id as Id<'users'>,
        tier,
      });
      window.location.href = sessionUrl;
    } catch (err) {
      console.error('Failed to create checkout session:', err);
      setError(err instanceof Error ? err.message : 'Failed to start checkout. Please try again.');
      setLoadingTier(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-4xl">
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm italic shadow-sm hover:shadow-md transition-shadow duration-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 animate-pulse" />
          <p className="font-medium">{description}</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium animate-in fade-in duration-300">
            {error}
          </div>
        )}

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-5 flex gap-4 text-primary-900 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="bg-primary-100 p-2.5 rounded-full shrink-0 h-fit">
            <Gift className="w-6 h-6 text-primary-600 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-base">{t('referral.emphasize.title')}</h3>
            <p className="text-sm text-primary-800 mt-1">{t('referral.emphasize.description')}</p>
            {isAuthenticated && (
              <button
                onClick={() => {
                  onClose();
                  router.push('/profile/view');
                }}
                className="text-primary-700 hover:text-primary-900 text-xs font-bold underline mt-2 block"
              >
                Go to your profile to share your code
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pb-2">
          {(Object.entries(TIER_CONFIG) as [TierKey, typeof TIER_CONFIG[TierKey]][]).map(
            ([key, config]) => (
              <PricingCard
                key={key}
                tier={key}
                name={config.name}
                price={config.price}
                originalPrice={'originalPrice' in config ? (config as any).originalPrice : undefined}
                currency={config.currency}
                interval={config.interval}
                features={config.features}
                applicationsLimit={config.applicationsLimit}
                isCurrentPlan={currentTier === key}
                isPopular={'popular' in config && (config as any).popular === true}
                onSelect={() => handleSelect(key)}
                isLoading={loadingTier === key}
              />
            )
          )}
        </div>

        {/* Coupon Code Section */}
        <div className="text-center pt-2 border-t border-gray-100">
          {!showCoupon ? (
            <button
              onClick={() => setShowCoupon(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4" />
              Have a sponsor code?
            </button>
          ) : (
            <div className="flex gap-2 max-w-xs mx-auto">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
              />
              <button
                onClick={() => {
                  if (couponInput.trim()) {
                    onClose();
                    router.push(`/claim/${couponInput.trim()}`);
                  }
                }}
                disabled={!couponInput.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Redeem
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
