'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

import { useTranslation } from 'react-i18next';

interface PricingCardProps {
  tier: 'pro' | 'expert';
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  interval: string;
  features: readonly string[];
  applicationsLimit: number;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

export function PricingCard({
  tier,
  name,
  price,
  originalPrice,
  interval,
  features,
  applicationsLimit,
  isCurrentPlan = false,
  isPopular = false,
  onSelect,
  isLoading = false,
}: PricingCardProps) {
  const { t } = useTranslation();

  // Get translated name and features from i18n
  const translatedName = t(`pricing.tiers.${tier}.name`, { defaultValue: name });
  const translatedFeatures = t(`pricing.tiers.${tier}.features`, {
    returnObjects: true,
    defaultValue: features,
  }) as string[];

  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all duration-500 overflow-hidden transform hover:-translate-y-2',
        isPopular
          ? 'border-2 border-primary-500 shadow-[0_20px_50px_rgba(59,130,246,0.15)] bg-primary-50/5'
          : 'border border-gray-100 shadow-xl shadow-gray-200/50 hover:border-gray-300'
      )}
      padding="none"
      hover
    >
      {isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-[0.1em] shadow-sm">
            {t('pricing.mostPopular')}
          </div>
        </div>
      )}

      <div className="p-8 pt-10">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{translatedName}</h3>
        <p className="mt-2 text-sm text-gray-500 font-medium">
          {t('pricing.appsPerYear', { count: applicationsLimit })}
        </p>

        <div className="mt-8 flex items-baseline gap-1">
          {originalPrice && (
            <span className="text-xl text-gray-300 line-through font-medium mr-1">
              ${originalPrice}
            </span>
          )}
          <span className="text-5xl font-black text-gray-900 tracking-tighter">
            ${price}
          </span>
          <span className="text-gray-400 font-semibold ml-1">/{interval}</span>
        </div>

        <Button
          variant={isPopular ? 'primary' : 'secondary'}
          size="lg"
          className={cn(
            "w-full mt-8 py-7 rounded-2xl text-lg font-bold transition-all duration-300",
            isPopular ? "shadow-lg shadow-primary-200" : "bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200"
          )}
          onClick={onSelect}
          disabled={isCurrentPlan || isLoading}
          isLoading={isLoading}
        >
          {isCurrentPlan
            ? t('pricing.currentPlan')
            : t('pricing.getStarted', { name: translatedName })}
        </Button>
      </div>

      <div className={cn(
        "p-8 pt-4 flex-1",
        isPopular ? "bg-primary-50/20" : "bg-gray-50/30"
      )}>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
          {t('pricing.whatsIncluded')}
        </p>
        <ul className="space-y-4">
          {translatedFeatures.map((feature) => (
            <li key={feature} className="flex items-start gap-3 group">
              <div className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                isPopular ? "bg-primary-100 text-primary-600" : "bg-green-100 text-green-600"
              )}>
                <Check className="h-3 w-3" strokeWidth={3} />
              </div>
              <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors leading-tight">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
