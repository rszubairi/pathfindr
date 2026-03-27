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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" />

      {/* Modal */}
      <Card
        className="relative z-10 w-full max-w-md shadow-2xl border-0 overflow-hidden animate-in zoom-in-95 fade-in duration-300 rounded-[2rem]"
        padding="none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top gradient bar */}
        <div className="h-2 w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />
        
        <div className="flex items-center justify-end p-4 absolute top-2 right-0 z-20">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 sm:p-10">
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
      <div className="mx-auto w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-primary-50/50">
        <Lock className="h-8 w-8 text-primary-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Ready to Apply?
      </h3>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Join our community of future leaders. Sign in or create an account to start your scholarship journey.
      </p>
      <div className="space-y-4">
        <Link href={registerUrl} className="block w-full">
          <Button variant="primary" size="lg" className="w-full py-6 text-lg shadow-lg shadow-primary-100">
            Create Free Account
          </Button>
        </Link>
        <Link href={loginUrl} className="block w-full">
          <Button variant="secondary" size="md" className="w-full py-4 text-gray-700 font-semibold border-gray-200">
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
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-200 rotate-3">
        <Lock className="h-8 w-8 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Unlock Your Future
      </h3>
      <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
        Join thousands of students securing their future. Choose a plan to start applying today.
      </p>

      <div className="space-y-4 mb-8">
        {/* Expert Plan (Recommended) */}
        <div className="relative p-5 rounded-2xl border-2 border-primary-500 bg-primary-50/40 overflow-hidden group hover:bg-primary-50 transition-colors">
          <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-left">
              <h4 className="font-extrabold text-gray-900 text-lg">Expert</h4>
              <p className="text-xs text-gray-500">For ambitious students</p>
            </div>
            <div className="text-right">
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-gray-900">$79</span>
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">/ year</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary-700 font-bold text-sm">
            <CheckCircle2 className="h-4 w-4 fill-primary-500 text-white" />
            20 Scholarship Applications
          </div>
        </div>

        {/* Pro Plan */}
        <div className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-primary-200 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-2">
            <div className="text-left">
              <h4 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">Pro</h4>
              <p className="text-xs text-gray-500">Essential features</p>
            </div>
            <div className="text-right">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 line-through">$25</span>
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-gray-900">$9.99</span>
                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap">/ year</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            5 Scholarship Applications
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link href="/pricing" className="block">
          <Button variant="primary" size="lg" className="w-full shadow-xl shadow-primary-100 py-7 text-lg font-bold rounded-2xl">
            View All Plans & Features
          </Button>
        </Link>
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
          <CheckCircle2 className="h-3 w-3" />
          Secure Stripe Payment • Clear Pricing
        </div>
      </div>
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
      <div className="mx-auto w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-amber-50/50">
        <ArrowUpCircle className="h-8 w-8 text-amber-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Limit Reached
      </h3>
      {isProUser ? (
        <>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You&apos;ve used all <span className="font-bold text-gray-900">{TIER_CONFIG.pro.applicationsLimit} applications</span> in your Pro plan. Upgrade to Expert for more opportunities.
          </p>
          <Link href="/pricing" className="block">
            <Button variant="primary" size="lg" className="w-full py-6 text-lg shadow-lg shadow-primary-100">
              Upgrade to Expert
            </Button>
          </Link>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You&apos;ve used all <span className="font-bold text-gray-900">{TIER_CONFIG.expert.applicationsLimit} applications</span> for this year. Your limit will reset on renewal.
          </p>
          <Button variant="secondary" size="md" className="w-full py-4 text-gray-700 font-semibold border-gray-200" onClick={() => window.location.reload()}>
            Refresh Status
          </Button>
        </>
      )}
    </div>
  );
}

function AlreadyAppliedContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-green-50/50">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Application Tracking
      </h3>
      <p className="text-gray-600 mb-8 leading-relaxed">
        You&apos;ve already submitted an application for this scholarship. You can track all your progress in the dashboard.
      </p>
      <div className="space-y-4">
        <Link href="/dashboard" className="block">
          <Button variant="primary" size="lg" className="w-full py-6 text-lg">
            Go to Dashboard
          </Button>
        </Link>
        <button 
          onClick={onClose}
          className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
