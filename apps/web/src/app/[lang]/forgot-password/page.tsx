'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/components/layout/MainLayout';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPasswordReset = useAction(api.authActions.requestPasswordReset);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await requestPasswordReset({ email: data.email });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Container className="py-8 sm:py-16">
        <div className="max-w-md mx-auto px-1 sm:px-0">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Forgot your password?
            </h1>
            <p className="text-gray-600">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <Card className="p-6">
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-800 font-medium">Check your inbox</p>
                <p className="text-gray-600 text-sm">
                  If an account exists for that email, we&apos;ve sent a password reset link. It expires in 1 hour.
                </p>
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Back to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send reset link'}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Back to sign in
                  </Link>
                </p>
              </form>
            )}
          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}
