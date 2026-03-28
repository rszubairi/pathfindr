'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAction, useQuery } from 'convex/react';
import { api } from '../../../../../../../convex/_generated/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Heart, Copy, Check, ExternalLink } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const verifySession = useAction(api.corporateDonationActions.verifyDonationCheckoutSession);

  const [sessionData, setSessionData] = useState<{
    status: string;
    tier: string;
    quantity: number;
    couponCode: string | null;
  } | null>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Poll for the donation record created by the webhook
  const donation = useQuery(
    api.corporateDonations.getDonationByCheckoutSession,
    sessionId ? { sessionId } : 'skip'
  );

  useEffect(() => {
    if (!sessionId) return;

    verifySession({ sessionId })
      .then(setSessionData)
      .catch(() => setError(true));
  }, [sessionId, verifySession]);

  const couponCode = donation?.couponCode;
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const claimLink = couponCode ? `${appUrl}/claim/${couponCode}` : '';

  const handleCopy = () => {
    if (claimLink) {
      navigator.clipboard.writeText(claimLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="max-w-lg mx-auto py-20">
        <Card className="text-center">
          <CardContent className="py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t verify your donation. Please contact support if the issue persists.
            </p>
            <Link href="/dashboard/donations">
              <Button variant="primary">Back to Donations</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-12">
      <Card className="text-center">
        <CardContent className="py-12">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank you for your generosity!</h1>

          {sessionData && (
            <p className="text-lg text-gray-600 mb-6">
              Your donation of{' '}
              <span className="font-semibold">
                {sessionData.quantity} {sessionData.tier} subscription
                {sessionData.quantity > 1 ? 's' : ''}
              </span>{' '}
              has been processed successfully.
            </p>
          )}

          {!sessionData && !error && (
            <p className="text-gray-600 mb-6">Verifying your donation...</p>
          )}

          {/* Coupon Code Display */}
          {couponCode ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <p className="text-sm font-medium text-amber-800 mb-2">Your Coupon Code</p>
              <p className="text-3xl font-bold font-mono tracking-widest text-gray-900 mb-3">
                {couponCode}
              </p>
              <div className="flex items-center justify-center gap-2 mb-3">
                <code className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded border border-gray-200 max-w-full overflow-hidden text-ellipsis">
                  {claimLink}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy link"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-amber-700">
                Share this link with students to let them claim their free subscription
              </p>
            </div>
          ) : sessionData ? (
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-500">
                Processing donation... Your coupon code will appear shortly.
              </p>
            </div>
          ) : null}

          {donation && (
            <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-gray-600">
              <div className="flex justify-between mb-1">
                <span>Subscriptions purchased:</span>
                <span className="font-medium">{donation.quantityPurchased}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Auto-assigned to students:</span>
                <span className="font-medium">{donation.quantityAssigned}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining for new students:</span>
                <span className="font-medium">{donation.quantityRemaining}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/donations">
              <Button variant="primary" size="lg" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                View Donation Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto py-20">
          <Card className="text-center">
            <CardContent className="py-12">
              <p className="text-gray-600">Loading...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
