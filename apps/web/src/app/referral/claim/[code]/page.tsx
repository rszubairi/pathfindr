'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../../../../convex/_generated/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle2, Gift, AlertCircle, XCircle } from 'lucide-react';
import type { Id } from '../../../../../../../convex/_generated/dataModel';

export default function ClaimReferralCouponPage() {
  const params = useParams();
  const code = params.code as string;
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const validation = useQuery(
    api.referrals.validateReferralCoupon,
    code ? { couponCode: code } : 'skip'
  );

  const subscription = useQuery(
    api.subscriptions.getUserSubscription,
    user?._id ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const claimCoupon = useMutation(api.referrals.claimReferralCoupon);

  const handleClaim = async () => {
    if (!user?._id) return;

    setClaiming(true);
    setClaimError(null);

    try {
      await claimCoupon({
        couponCode: code,
        claimingUserId: user._id as Id<'users'>,
      });
      setClaimed(true);
    } catch (err: any) {
      setClaimError(err.message || t('referral.claim.error.generic', { defaultValue: 'Failed to claim coupon. Please try again.' }));
    } finally {
      setClaiming(false);
    }
  };

  const isLoading = authLoading || validation === undefined;
  const hasActiveSubscription = subscription && subscription.status === 'active';
  const isStudent = user?.role === 'student';

  // Success state
  if (claimed) {
    return (
      <MainLayout>
        <section className="py-20">
          <Container size="sm">
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('referral.claim.success.title')}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {t('referral.claim.success.description', { name: validation?.referrerName })}
                </p>
                <p className="text-gray-500 mb-8">
                  {t('referral.claim.success.nextSteps')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/scholarships">
                    <Button variant="primary" size="lg">
                      {t('referral.claim.success.browseBtn')}
                    </Button>
                  </Link>
                  <Link href="/subscription/manage">
                    <Button variant="secondary" size="lg">
                      {t('referral.claim.success.viewSubBtn')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </Container>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="py-20">
        <Container size="sm">
          {isLoading ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">{t('referral.claim.validating')}</p>
              </CardContent>
            </Card>
          ) : !validation?.valid ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('referral.claim.error.notAvailable')}
                </h1>
                <p className="text-gray-600 mb-6">
                  {t('referral.claim.error.invalidOrClaimed')}
                </p>
                <Link href="/pricing">
                  <Button variant="primary">{t('referral.claim.error.viewPricing')}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : !user ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <Gift className="h-8 w-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('referral.claim.gift.title')}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {t('referral.claim.gift.subtitle', { name: validation.referrerName })}
                </p>
                <p className="text-gray-500 mb-8">
                  {t('referral.claim.gift.instruction')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/register?redirect=/referral/claim/${code}`}>
                    <Button variant="primary" size="lg">
                      {t('referral.claim.gift.registerBtn')}
                    </Button>
                  </Link>
                  <Link href={`/login?redirect=/referral/claim/${code}`}>
                    <Button variant="secondary" size="lg">
                      {t('referral.claim.gift.loginBtn')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : !isStudent ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('referral.claim.error.studentRequired')}
                </h1>
                <p className="text-gray-600 mb-6">
                  {t('referral.claim.error.studentRequiredDesc')}
                </p>
                <Link href="/dashboard">
                  <Button variant="primary">{t('referral.claim.error.goToDashboard')}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : hasActiveSubscription ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('referral.claim.error.alreadySubscribed')}
                </h1>
                <p className="text-gray-600 mb-6">
                  {t('referral.claim.error.alreadySubscribedDesc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/scholarships">
                    <Button variant="primary">{t('referral.claim.success.browseBtn')}</Button>
                  </Link>
                  <Link href="/subscription/manage">
                    <Button variant="secondary">{t('referral.claim.error.manageSub')}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <Gift className="h-8 w-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('referral.claim.gift.claimTitle')}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {t('referral.claim.gift.sharedBy', { name: validation.referrerName })}
                </p>
                <p className="text-gray-500 mb-4">
                  {t('referral.claim.gift.fullAccess')}
                </p>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 max-w-sm mx-auto">
                  <p className="text-green-800 font-medium text-sm">
                    {t('referral.claim.gift.planFree')}
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    {t('referral.claim.gift.normalPrice', { name: validation.referrerName })}
                  </p>
                </div>

                {claimError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 max-w-sm mx-auto">
                    <p className="text-red-700 text-sm">{claimError}</p>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleClaim}
                  isLoading={claiming}
                  disabled={claiming}
                  className="px-8"
                >
                  <Gift className="w-5 h-5 mr-2" />
                  {t('referral.claim.gift.claimBtn')}
                </Button>
              </CardContent>
            </Card>
          )}
        </Container>
      </section>
    </MainLayout>
  );
}
