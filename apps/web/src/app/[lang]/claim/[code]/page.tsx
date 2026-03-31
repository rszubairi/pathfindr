'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useAction } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '@convex/_generated/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Gift, AlertCircle, XCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import type { Id } from '@convex/_generated/dataModel';

export default function ClaimCouponPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const code = params.code as string;
  const { user, loading: authLoading } = useAuth();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const validation = useQuery(
    api.corporateDonations.validateCouponCode,
    code ? { couponCode: code } : 'skip'
  );

  const donation = useQuery(
    api.corporateDonations.getDonationByCouponCode,
    code ? { couponCode: code } : 'skip'
  );

  // Check if user already has an active subscription
  const subscription = useQuery(
    api.subscriptions.getUserSubscription,
    user?._id ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const assignDonation = useMutation(api.corporateDonations.assignDonationToStudent);
  const sendNotification = useAction(api.corporateDonationActions.sendDonationNotificationEmail);

  const handleClaim = async () => {
    if (!user?._id || !donation?._id) return;

    setClaiming(true);
    setClaimError(null);

    try {
      await assignDonation({
        donationId: donation._id,
        studentUserId: user._id as Id<'users'>,
        claimMethod: 'coupon_claimed',
        couponCode: code,
      });

      // Send notification email
      await sendNotification({
        studentUserId: user._id as Id<'users'>,
        corporateUserId: donation.corporateUserId,
        tier: donation.tier,
      });

      setClaimed(true);
    } catch (err: any) {
      setClaimError(err.message || t('sponsorship.claim.error.generic', { defaultValue: 'Failed to claim subscription. Please try again.' }));
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
                  {t('sponsorship.claim.success.title')}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {t('sponsorship.claim.success.description', { 
                    tier: validation?.tier === 'pro' ? 'Pro' : 'Expert',
                    company: validation?.companyName 
                  })}
                </p>
                <p className="text-gray-500 mb-8">
                  {t('sponsorship.claim.success.nextSteps')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/scholarships">
                    <Button variant="primary" size="lg">
                      {t('sponsorship.claim.success.browseBtn')}
                    </Button>
                  </Link>
                  <Link href="/subscription/manage">
                    <Button variant="secondary" size="lg">
                      {t('sponsorship.claim.success.viewSubBtn')}
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
                <p className="text-gray-600">{t('sponsorship.claim.validating')}</p>
              </CardContent>
            </Card>
          ) : !validation?.valid ? (
            /* Invalid / Exhausted coupon */
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('sponsorship.claim.error.notAvailable')}
                </h1>
                <p className="text-gray-600 mb-6">
                  {t('sponsorship.claim.error.invalidOrExhausted')}
                </p>
                <Link href="/pricing">
                  <Button variant="primary">{t('sponsorship.claim.error.viewPricing')}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : !user ? (
            /* Not logged in */
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <Gift className="h-8 w-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('sponsorship.claim.gift.title')}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {t('sponsorship.claim.gift.subtitle', { 
                    company: validation.companyName,
                    tier: validation.tier === 'pro' ? 'Pro' : 'Expert'
                  })}
                </p>
                <p className="text-gray-500 mb-8">
                  {t('sponsorship.claim.gift.instruction')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/register?coupon=${code}`}>
                    <Button variant="primary" size="lg">
                      {t('sponsorship.claim.gift.registerBtn')}
                    </Button>
                  </Link>
                  <Link href={`/login?redirect=/claim/${code}`}>
                    <Button variant="secondary" size="lg">
                      {t('sponsorship.claim.gift.loginBtn')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : !isStudent ? (
            /* Not a student */
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('sponsorship.claim.error.studentRequired')}
                </h1>
                <p className="text-gray-600 mb-6">
                  {t('sponsorship.claim.error.studentRequiredDesc')}
                </p>
                <Link href="/dashboard">
                  <Button variant="primary">{t('sponsorship.claim.error.goToDashboard')}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : hasActiveSubscription ? (
            /* Already has subscription */
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('sponsorship.claim.error.alreadySubscribed')}
                </h1>
                <p className="text-gray-600 mb-6">
                  {t('sponsorship.claim.error.alreadySubscribedDesc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/scholarships">
                    <Button variant="primary">{t('sponsorship.claim.success.browseBtn')}</Button>
                  </Link>
                  <Link href="/subscription/manage">
                    <Button variant="secondary">{t('sponsorship.claim.error.manageSub')}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Valid coupon, logged-in student, no subscription — can claim */
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <Gift className="h-8 w-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('sponsorship.claim.gift.claimTitle')}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {t('sponsorship.claim.gift.sharedBy', { 
                    company: validation.companyName,
                    tier: validation.tier === 'pro' ? 'Pro' : 'Expert'
                  })}
                </p>
                <p className="text-gray-500 mb-4">
                  {t('sponsorship.claim.gift.fullAccess')}
                </p>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 max-w-sm mx-auto">
                  <p className="text-green-800 font-medium text-sm">
                    {t('sponsorship.claim.gift.planFree', { tier: validation.tier === 'pro' ? 'Pro' : 'Expert' })}
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    {t('sponsorship.claim.gift.normalPrice', { 
                      price: validation.tier === 'pro' ? '9.99' : '49.99',
                      company: validation.companyName 
                    })}
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
                  {t('sponsorship.claim.gift.claimBtn')}
                </Button>

                <p className="text-xs text-gray-400 mt-4">
                  {t('sponsorship.claim.gift.remainingSlots', { count: validation.remainingSlots })}
                </p>
              </CardContent>
            </Card>
          )}
        </Container>
      </section>
    </MainLayout>
  );
}
