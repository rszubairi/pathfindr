'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  tier: 'pro' | 'expert';
  name: string;
  price: number;
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
  currency,
  interval,
  features,
  applicationsLimit,
  isCurrentPlan = false,
  isPopular = false,
  onSelect,
  isLoading = false,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col',
        isPopular
          ? 'border-2 border-primary-500 shadow-lg'
          : 'border border-gray-200'
      )}
      padding="none"
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="primary" size="md">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {applicationsLimit} scholarship applications per year
        </p>

        <div className="mt-6">
          <span className="text-4xl font-bold text-gray-900">
            ${price}
          </span>
          <span className="text-gray-500 ml-1">/{interval}</span>
        </div>

        <Button
          variant={isPopular ? 'primary' : 'secondary'}
          size="lg"
          className="w-full mt-6"
          onClick={onSelect}
          disabled={isCurrentPlan || isLoading}
          isLoading={isLoading}
        >
          {isCurrentPlan ? 'Current Plan' : `Get ${name}`}
        </Button>
      </div>

      <div className="border-t border-gray-100 p-8 pt-6 flex-1">
        <p className="text-sm font-semibold text-gray-900 mb-4">
          What&apos;s included:
        </p>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
