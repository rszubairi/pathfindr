'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/components/layout/MainLayout';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = useAction(api.authActions.resetPassword);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!token) {
    return (
      <MainLayout>
        <Container className="py-8 sm:py-16">
          <div className="max-w-md mx-auto px-1 sm:px-0">
            <Card className="p-6 text-center space-y-4">
              <p className="text-red-600 font-medium">Invalid reset link</p>
              <p className="text-gray-600 text-sm">
                This reset link is missing or invalid. Please request a new one.
              </p>
              <Link href="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Request new link
              </Link>
            </Card>
          </div>
        </Container>
      </MainLayout>
    );
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await resetPassword({ token, newPassword: data.password });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Failed to reset password. Please try again.');
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
              Set new password
            </h1>
            <p className="text-gray-600">Choose a strong password for your account.</p>
          </div>

          <Card className="p-6">
            {success ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-800 font-medium">Password updated!</p>
                <p className="text-gray-600 text-sm">
                  Redirecting you to sign in...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}{' '}
                    {error.toLowerCase().includes('expired') && (
                      <Link href="/forgot-password" className="underline font-medium">
                        Request a new link
                      </Link>
                    )}
                  </div>
                )}

                <Input
                  label="New password"
                  type="password"
                  placeholder="At least 8 characters"
                  {...register('password')}
                  error={errors.password?.message}
                  required
                />

                <Input
                  label="Confirm new password"
                  type="password"
                  placeholder="Repeat your new password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
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
                  {isSubmitting ? 'Updating...' : 'Update password'}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
