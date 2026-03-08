'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/components/layout/MainLayout';
import { Mail } from 'lucide-react';

export default function CheckEmailPage() {
  return (
    <MainLayout>
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check your email
            </h1>
            <p className="text-gray-600 mb-6">
              We&apos;ve sent you a verification link. Please check your inbox
              and click the link to verify your account.
            </p>

            <p className="text-sm text-gray-500 mb-6">
              The link will expire in 24 hours. Check your spam folder if you
              don&apos;t see it.
            </p>

            <div className="space-y-3">
              <Button variant="primary" size="md" className="w-full" asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/register/resend-verification">
                  Didn&apos;t receive the email? Resend
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}
