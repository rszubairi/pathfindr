'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAction, useQuery as useConvexQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
  const [portalLoading, setPortalLoading] = useState(false);

  const applications = useConvexQuery(
    api.subscriptions.getUserApplications,
    user ? { userId: user._id as Id<'users'> } : 'skip'
  );

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
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
