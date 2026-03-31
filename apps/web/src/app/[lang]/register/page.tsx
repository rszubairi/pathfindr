'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAction, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTranslation } from 'react-i18next';
import { Gift } from 'lucide-react';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const couponCode = searchParams.get('coupon');
  const refCode = searchParams.get('ref');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = useAction(api.authActions.registerUser);

  const couponValidation = useQuery(
    api.corporateDonations.validateCouponCode,
    couponCode ? { couponCode } : 'skip'
  );

  const referralValidation = useQuery(
    api.referrals.validateReferralCode,
    refCode ? { referralCode: refCode } : 'skip'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        referredByCode: data.referralCode || refCode || undefined,
      });
      // Bypassing check-email screen for development
      const claimRedirect = couponCode ? `/claim/${couponCode}` : null;
      const finalRedirect = claimRedirect || redirectTo;
      const loginUrl = finalRedirect
        ? `/login?registered=true&redirect=${encodeURIComponent(finalRedirect)}`
        : '/login?registered=true';
      router.push(loginUrl);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Registration failed. Please try again.');
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
              Create your account
            </h1>
            <p className="text-gray-600">
              Start your journey to finding the perfect scholarship
            </p>
          </div>

          <Card className="p-6">
            {couponCode && couponValidation?.valid && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm text-green-800">
                  <span className="font-bold">{couponValidation.companyName}</span> is sponsoring
                  your subscription! Register to claim your free{' '}
                  <span className="font-semibold capitalize">{couponValidation.tier}</span> plan.
                </p>
              </div>
            )}

            {refCode && referralValidation?.valid && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm text-green-800">
                  Referred by <span className="font-bold">{referralValidation.referrerName}</span>!
                  Your registration will count toward their referral rewards.
                </p>
              </div>
            )}

            <div className="mb-6 bg-primary-50 border border-primary-200 rounded-lg p-4 text-center">
              <p className="text-sm text-primary-800">
                Are you a scholarship provider or institution?{' '}
                <Link
                  href="/register/institution"
                  className="font-bold underline hover:text-primary-900"
                >
                  Click here to register
                </Link>
              </p>
            </div>

            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-blue-800 shadow-sm hover:shadow-md transition-shadow duration-300">
              <Gift className="w-6 h-6 shrink-0 text-blue-600" />
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider">{t('referral.emphasize.title')}</h3>
                <p className="text-sm mt-0.5">{t('referral.emphasize.description')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                placeholder="Enter your full name"
                {...register('fullName')}
                error={errors.fullName?.message}
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                error={errors.email?.message}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...register('phone')}
                error={errors.phone?.message}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                {...register('password')}
                error={errors.password?.message}
                helperText="At least 8 characters, one uppercase letter, and one number"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                required
              />

              {!refCode && (
                <Input
                  label="Referral Code (optional)"
                  placeholder="Enter a friend's referral code"
                  {...register('referralCode')}
                  error={errors.referralCode?.message}
                />
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </Link>
            </p>

          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}
