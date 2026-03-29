'use client';

import React from 'react';
import { StatsSection } from './StatsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { DetailedFeaturesSection } from './DetailedFeaturesSection';
import { FeaturedScholarshipsSection } from './FeaturedScholarshipsSection';
import { PricingSection } from './PricingSection';
import { TestimonialsSection } from './TestimonialsSection';
import { CTASection } from './CTASection';

export function HomeBelowFold() {
  return (
    <>
      <StatsSection />
      <HowItWorksSection />
      <DetailedFeaturesSection />
      <FeaturedScholarshipsSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
