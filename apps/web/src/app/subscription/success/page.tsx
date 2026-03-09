'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, BookOpen, Settings } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const verifySession = useAction(api.stripeActions.verifyCheckoutSession);
  const [sessionData, setSessionData] = useState<{
    status: string;
    tier: string;
    customerEmail: string | null;
  } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    verifySession({ sessionId })
      .then(setSessionData)
      .catch(() => setError(true));
  }, [sessionId, verifySession]);

  if (error) {
    return (
      <MainLayout>
        <section className="py-20">
          <Container size="sm">
            <Card className="text-center">
              <CardContent className="py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Something went wrong
                </h1>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t verify your subscription. Please contact
                  support if the issue persists.
                </p>
                <Link href="/pricing">
                  <Button variant="primary">Back to Pricing</Button>
                </Link>
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
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Subscription activated!
              </h1>

              {sessionData && (
                <p className="text-lg text-gray-600 mb-8">
                  Welcome to the{' '}
                  <span className="font-semibold capitalize">
                    {sessionData.tier}
                  </span>{' '}
                  plan. You can now start applying for scholarships.
                </p>
              )}

              {!sessionData && !error && (
                <p className="text-gray-600 mb-8">
                  Verifying your subscription...
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/scholarships">
                  <Button variant="primary" size="lg" className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Browse Scholarships
                  </Button>
                </Link>
                <Link href="/subscription/manage">
                  <Button variant="secondary" size="lg" className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Manage Subscription
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

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <section className="py-20">
            <Container size="sm">
              <Card className="text-center">
                <CardContent className="py-12">
                  <p className="text-gray-600">Loading...</p>
                </CardContent>
              </Card>
            </Container>
          </section>
        </MainLayout>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
