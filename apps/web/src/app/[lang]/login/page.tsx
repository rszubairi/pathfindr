'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useAppDispatch } from '@/store';
import { setUser, setToken } from '@/store/slices/authSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/components/layout/MainLayout';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = useAction(api.authActions.loginUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
      });

      // Store in localStorage for persistence
      localStorage.setItem('token', result.token);
      localStorage.setItem('userId', result.user._id);

      // Update Redux state
      dispatch(setToken(result.token));
      dispatch(
        setUser({
          id: result.user._id,
          email: result.user.email,
          fullName: result.user.fullName,
          role: result.user.role,
        })
      );

      // Redirect based on role, profile completion, or redirect param
      if (result.user.role === 'institution' || result.user.role === 'corporate') {
        router.push('/dashboard');
      } else if (result.user.role === 'admin') {
        router.push('/admin/institutions');
      } else if (!result.user.profileCompleted) {
        router.push('/profile/complete');
      } else if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push('/scholarships');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Login failed. Please try again.');
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
              Welcome back
            </h1>
            <p className="text-gray-600">Sign in to your Pathfindr account</p>
          </div>

          <Card className="p-6">
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

              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                  error={errors.password?.message}
                  required
                />
                <div className="mt-1 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href={redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : '/register'}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Create one
              </Link>
            </p>
          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
