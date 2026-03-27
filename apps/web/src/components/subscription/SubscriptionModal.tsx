'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Modal } from '@/components/ui/Modal';
import { PricingCard } from './PricingCard';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { TIER_CONFIG, type TierKey } from '@/lib/stripe';
import type { Id } from '@convex/_generated/dataModel';
import { AlertCircle } from 'lucide-react';

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
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { tier: currentTier } = useSubscription();
  const createCheckout = useAction(api.stripeActions.createCheckoutSession);
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      </div>
    </Modal>
  );
}
