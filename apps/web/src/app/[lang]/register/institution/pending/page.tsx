'use client';

import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/components/layout/MainLayout';

export default function InstitutionPendingPage() {
  return (
    <MainLayout>
      <Container className="py-16">
        <div className="max-w-md mx-auto text-center">
          <Card className="p-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Registration Under Review
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Thank you for registering your institution on Pathfindr. Our team will review
              your details and verify your institution. You will receive an email once your
              account has been approved.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-700">
                <strong>What happens next?</strong>
              </p>
              <ul className="text-sm text-blue-600 mt-2 space-y-1 list-disc list-inside">
                <li>Our team reviews your corporate identity</li>
                <li>We contact your person in charge for verification</li>
                <li>You receive an approval email (typically 1-2 business days)</li>
                <li>Log in and start managing scholarships</li>
              </ul>
            </div>

            <Button variant="secondary" size="md" asChild>
              <Link href="/" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}
