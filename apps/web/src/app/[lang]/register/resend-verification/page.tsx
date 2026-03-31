'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const resendSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResendFormData = z.infer<typeof resendSchema>;

export default function ResendVerificationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resendVerification = useAction(api.authActions.resendVerification);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
  });

  const onSubmit = async (data: ResendFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await resendVerification({ email: data.email });
      setSuccess(true);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to resend verification email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Resend verification email
            </h1>
            <p className="text-gray-600">
              Enter your email to receive a new verification link
            </p>
          </div>

          <Card className="p-6">
            {success ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Email sent!
                </h2>
                <p className="text-gray-600 mb-6">
                  If an account exists with that email, you&apos;ll receive a
                  new verification link shortly.
                </p>
                <Button variant="primary" size="md" asChild>
                  <Link href="/login">Go to Login</Link>
                </Button>
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
                  {isSubmitting ? 'Sending...' : 'Resend verification email'}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  <Link
                    href="/register"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Back to registration
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
