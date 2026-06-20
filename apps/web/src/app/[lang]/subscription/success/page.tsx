'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, BookOpen, Settings, Download, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

function SuccessContent() {
  const searchParams = useSearchParams();
  const externalId = searchParams.get('external_id');
  const verifySession = useAction(api.xenditActions.verifyCheckoutSession);
  const getInvoiceUrl = useAction(api.invoices.getInvoiceDownloadUrl);

  const [sessionData, setSessionData] = useState<{
    status: string;
    tier: string;
    customerEmail: string | null;
  } | null>(null);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    if (!externalId) return;
    verifySession({ externalId })
      .then(setSessionData)
      .catch(() => setError(true));
  }, [externalId, verifySession]);

  async function handleDownloadInvoice() {
    if (!userId) return;
    setDownloading(true);
    try {
      const url = await getInvoiceUrl({ userId });
      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
        a.target = '_blank';
        a.click();
      } else {
        alert('Invoice is still being generated. Please check your email or try again in a moment.');
      }
    } catch {
      alert('Could not download invoice. Please check your email.');
    } finally {
      setDownloading(false);
    }
  }

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
                <p className="text-lg text-gray-600 mb-2">
                  Welcome to the{' '}
                  <span className="font-semibold capitalize">
                    {sessionData.tier}
                  </span>{' '}
                  plan. You can now start applying for scholarships.
                </p>
              )}

              {!sessionData && !error && (
                <p className="text-gray-600 mb-2">
                  Verifying your subscription...
                </p>
              )}

              {sessionData && (
                <p className="text-sm text-gray-500 mb-8">
                  An invoice has been sent to your email. You can also download it below.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
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

              {userId && sessionData && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadInvoice}
                  disabled={downloading}
                  className="flex items-center gap-2 mx-auto"
                >
                  {downloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloading ? 'Preparing invoice…' : 'Download Invoice (PDF)'}
                </Button>
              )}
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
