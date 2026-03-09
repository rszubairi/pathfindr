'use client';

import React from 'react';
import Link from 'next/link';
import { X, Lock, ArrowUpCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TIER_CONFIG } from '@/lib/stripe';

export type GateReason = 'auth' | 'subscribe' | 'limit_reached' | 'already_applied';

interface SubscriptionGateProps {
  isOpen: boolean;
  onClose: () => void;
  gateReason: GateReason;
  currentTier?: 'pro' | 'expert' | null;
  redirectPath?: string;
}

export function SubscriptionGate({
  isOpen,
  onClose,
  gateReason,
  currentTier,
  redirectPath,
}: SubscriptionGateProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <Card
        className="relative z-10 w-full max-w-md"
        padding="none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <div />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 pt-2">
          {gateReason === 'auth' && <AuthContent redirectPath={redirectPath} />}
          {gateReason === 'subscribe' && <SubscribeContent />}
          {gateReason === 'limit_reached' && (
            <LimitReachedContent currentTier={currentTier} />
          )}
          {gateReason === 'already_applied' && <AlreadyAppliedContent onClose={onClose} />}
        </div>
      </Card>
    </div>
  );
}

function AuthContent({ redirectPath }: { redirectPath?: string }) {
  const registerUrl = redirectPath
    ? `/register?redirect=${encodeURIComponent(redirectPath)}`
    : '/register';
  const loginUrl = redirectPath
    ? `/login?redirect=${encodeURIComponent(redirectPath)}`
    : '/login';

  return (
    <div className="text-center">
      <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
        <Lock className="h-6 w-6 text-primary-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Sign in to apply
      </h3>
      <p className="text-gray-600 mb-6">
        Create an account or sign in to apply for scholarships through Pathfindr.
      </p>
      <div className="space-y-3">
        <Link href={registerUrl}>
          <Button variant="primary" size="lg" className="w-full">
            Create Account
          </Button>
        </Link>
        <Link href={loginUrl}>
          <Button variant="secondary" size="md" className="w-full">
            Already have an account? Sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SubscribeContent() {
  return (
    <div className="text-center">
      <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
        <ArrowUpCircle className="h-6 w-6 text-primary-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Subscription required
      </h3>
      <p className="text-gray-600 mb-6">
        Choose a plan to start applying to scholarships. Browse our Pro and Expert plans.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="border border-gray-200 rounded-lg p-4 text-left">
          <p className="font-semibold text-gray-900">Pro</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${TIER_CONFIG.pro.price}
            <span className="text-sm text-gray-500 font-normal">/yr</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {TIER_CONFIG.pro.applicationsLimit} applications
          </p>
        </div>
        <div className="border-2 border-primary-500 rounded-lg p-4 text-left">
          <p className="font-semibold text-primary-600">Expert</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${TIER_CONFIG.expert.price}
            <span className="text-sm text-gray-500 font-normal">/yr</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {TIER_CONFIG.expert.applicationsLimit} applications
          </p>
        </div>
      </div>
      <Link href="/pricing">
        <Button variant="primary" size="lg" className="w-full">
          View Plans
        </Button>
      </Link>
    </div>
  );
}

function LimitReachedContent({
  currentTier,
}: {
  currentTier?: 'pro' | 'expert' | null;
}) {
  const isProUser = currentTier === 'pro';

  return (
    <div className="text-center">
      <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
        <ArrowUpCircle className="h-6 w-6 text-yellow-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Application limit reached
      </h3>
      {isProUser ? (
        <>
          <p className="text-gray-600 mb-6">
            You&apos;ve used all {TIER_CONFIG.pro.applicationsLimit} applications
            in your Pro plan. Upgrade to Expert for{' '}
            {TIER_CONFIG.expert.applicationsLimit} applications per year.
          </p>
          <Link href="/pricing">
            <Button variant="primary" size="lg" className="w-full">
              Upgrade to Expert
            </Button>
          </Link>
        </>
      ) : (
        <p className="text-gray-600">
          You&apos;ve used all {TIER_CONFIG.expert.applicationsLimit} applications
          for this year. Your limit will reset when your subscription renews.
        </p>
      )}
    </div>
  );
}

function AlreadyAppliedContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Already applied
      </h3>
      <p className="text-gray-600 mb-6">
        You&apos;ve already submitted an application for this scholarship. You
        can track its status in your dashboard.
      </p>
      <Button variant="secondary" size="md" className="w-full" onClick={onClose}>
        Got it
      </Button>
    </div>
  );
}
