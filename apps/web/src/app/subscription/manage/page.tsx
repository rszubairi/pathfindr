'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAction, useQuery as useConvexQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { ApplicationTracker } from '@/components/subscription/ApplicationTracker';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import {
  CreditCard,
  Calendar,
  ArrowUpCircle,
  BookOpen,
  ExternalLink,
  Heart,
  Gift,
  Copy,
  Check,
} from 'lucide-react';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export default function ManageSubscriptionPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { subscription, isSubscribed, tier, applicationsUsed, applicationsLimit, isDonated, donatedBy, isLoading: subLoading } = useSubscription();

  const donorProfile = useConvexQuery(
    api.corporateDonations.getCompanyProfile,
    donatedBy ? { userId: donatedBy } : 'skip'
  );
  const createPortal = useAction(api.stripeActions.createPortalSession);
  const claimReferralCoupon = useMutation(api.referrals.claimReferralCoupon);
  const [portalLoading, setPortalLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponRedeeming, setCouponRedeeming] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const applications = useConvexQuery(
    api.subscriptions.getUserApplications,
    user ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const referralCoupons = useConvexQuery(
    api.referrals.getUserReferralCoupons,
    user ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const couponValidation = useConvexQuery(
    api.referrals.validateReferralCoupon,
    couponInput.length >= 6 ? { couponCode: couponInput } : 'skip'
  );

  const handleRedeemCoupon = async () => {
    if (!user || !couponInput.trim()) return;
    setCouponRedeeming(true);
    setCouponError(null);
    try {
      await claimReferralCoupon({
        couponCode: couponInput.trim(),
        claimingUserId: user._id as Id<'users'>,
      });
      setCouponSuccess(true);
    } catch (err: any) {
      setCouponError(err.message || 'Failed to redeem coupon');
    } finally {
      setCouponRedeeming(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user) return;
    setPortalLoading(true);
    try {
      const { portalUrl } = await createPortal({
        userId: user._id as Id<'users'>,
      });
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Failed to create portal session:', error);
      setPortalLoading(false);
    }
  };

  if (authLoading || subLoading) {
    return (
      <MainLayout>
        <section className="py-16">
          <Container size="lg">
            <div className="text-center text-gray-600">Loading...</div>
          </Container>
        </section>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <section className="py-16">
          <Container size="sm">
            <Card className="text-center">
              <CardContent className="py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Sign in required
                </h1>
                <p className="text-gray-600 mb-6">
                  Please sign in to manage your subscription.
                </p>
                <Link href="/login?redirect=/subscription/manage">
                  <Button variant="primary">Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          </Container>
        </section>
      </MainLayout>
    );
  }

  if (!isSubscribed) {
    return (
      <MainLayout>
        <section className="py-16">
          <Container size="sm">
            <Card className="text-center">
              <CardContent className="py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  No active subscription
                </h1>
                <p className="text-gray-600 mb-6">
                  Choose a plan to start applying for scholarships.
                </p>
                <Link href="/pricing">
                  <Button variant="primary">View Plans</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Referral Coupon Redemption */}
            <Card className="mt-6">
              <CardContent className="py-8">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Have a referral coupon?
                  </h2>
                </div>

                {couponSuccess ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-green-700 font-medium mb-2">
                      Subscription activated!
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Your free Pro subscription is now active.
                    </p>
                    <Link href="/scholarships">
                      <Button variant="primary" size="sm">
                        Browse Scholarships
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter a referral coupon code from a friend to activate a free Pro subscription.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError(null);
                        }}
                        placeholder="e.g. RFCOUP-XXXXXXXX"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleRedeemCoupon}
                        disabled={couponRedeeming || !couponInput.trim() || (couponValidation !== undefined && !couponValidation?.valid)}
                        isLoading={couponRedeeming}
                      >
                        Redeem
                      </Button>
                    </div>
                    {couponInput.length >= 6 && couponValidation?.valid && (
                      <p className="text-sm text-green-600 mt-2">
                        Valid coupon from {couponValidation.referrerName}
                      </p>
                    )}
                    {couponInput.length >= 6 && couponValidation && !couponValidation.valid && (
                      <p className="text-sm text-red-600 mt-2">
                        Invalid or already claimed coupon code
                      </p>
                    )}
                    {couponError && (
                      <p className="text-sm text-red-600 mt-2">{couponError}</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Container>
        </section>
      </MainLayout>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-10">
        <Container size="lg">
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your plan, billing, and view your application history.
          </p>
        </Container>
      </section>

      <section className="py-10 bg-gray-50">
        <Container size="lg">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Subscription Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Plan Details */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Your Plan
                    </h2>
                    <Badge
                      variant={subscription?.status === 'active' ? 'success' : 'warning'}
                      size="md"
                    >
                      {subscription?.status === 'active' ? 'Active' : subscription?.status}
                    </Badge>
                  </div>

                  {isDonated && donorProfile && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                      <Heart className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-800">
                        This subscription is sponsored by{' '}
                        <span className="font-bold">{donorProfile.institutionName}</span>.
                        Thank you for their generous support!
                      </p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Plan</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {tier} {isDonated && <span className="text-green-600 text-xs font-normal">(Sponsored)</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {subscription?.cancelAtPeriodEnd
                            ? 'Access until'
                            : 'Renews on'}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {subscription?.currentPeriodEnd
                            ? formatDate(subscription.currentPeriodEnd)
                            : '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {subscription?.cancelAtPeriodEnd && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Your subscription is set to cancel at the end of the
                        current billing period.
                      </p>
                    </div>
                  )}

                  {!isDonated && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleManageBilling}
                        isLoading={portalLoading}
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        Manage Billing
                      </Button>
                      {tier === 'pro' && (
                        <Link href="/pricing">
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <ArrowUpCircle className="h-4 w-4" />
                            Upgrade to Expert
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Application History */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Application History
                  </h2>
                  {!applications || applications.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No applications yet. Start browsing scholarships!
                      </p>
                      <Link href="/scholarships" className="mt-3 inline-block">
                        <Button variant="link" size="sm">
                          Browse Scholarships
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {applications.map((app: any) => (
                        <div
                          key={app._id}
                          className="py-4 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {app.scholarshipName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {app.scholarshipProvider} &middot; Applied{' '}
                              {formatDate(app.appliedAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                app.status === 'applied'
                                  ? 'primary'
                                  : app.status === 'awarded'
                                    ? 'success'
                                    : app.status === 'rejected'
                                      ? 'danger'
                                      : 'default'
                              }
                              size="sm"
                            >
                              {app.status.replace('_', ' ')}
                            </Badge>
                            <Link
                              href={`/scholarships/detail?id=${app.scholarshipId}`}
                            >
                              <ExternalLink className="h-4 w-4 text-gray-400 hover:text-primary-600" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {tier && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Usage
                    </h3>
                    <ApplicationTracker
                      used={applicationsUsed}
                      limit={applicationsLimit}
                      tier={tier}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Referral Coupons */}
              {referralCoupons && referralCoupons.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Gift className="w-5 h-5 text-primary-600" />
                      <h3 className="font-bold text-gray-900">
                        Referral Coupons
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {referralCoupons.map((coupon) => (
                        <div
                          key={coupon._id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <code className="text-sm font-mono font-bold text-gray-900">
                              {coupon.couponCode}
                            </code>
                            <Badge
                              variant={coupon.couponStatus === 'available' ? 'success' : 'default'}
                              size="sm"
                            >
                              {coupon.couponStatus === 'available' ? 'Available' : 'Claimed'}
                            </Badge>
                          </div>
                          {coupon.couponStatus === 'available' && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(coupon.couponCode);
                                setCopiedCoupon(coupon.couponCode);
                                setTimeout(() => setCopiedCoupon(null), 2000);
                              }}
                              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 mt-1"
                            >
                              {copiedCoupon === coupon.couponCode ? (
                                <>
                                  <Check className="w-3 h-3" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy to share
                                </>
                              )}
                            </button>
                          )}
                          {coupon.couponStatus === 'claimed' && coupon.claimedByName && (
                            <p className="text-xs text-gray-500 mt-1">
                              Claimed by {coupon.claimedByName}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
