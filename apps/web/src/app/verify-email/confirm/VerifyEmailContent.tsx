'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
        'verifying'
    );
    const [errorMessage, setErrorMessage] = useState('');
    const verifyEmail = useMutation(api.auth.verifyEmail);

    useEffect(() => {
        const verify = async () => {
            try {
                if (!token) throw new Error('No token provided');
                await verifyEmail({ token });
                setStatus('success');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } catch (err) {
                const error = err as Error;
                setStatus('error');
                setErrorMessage(
                    error.message || 'Verification failed. The link may have expired.'
                );
            }
        };

        verify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <MainLayout>
            <Container className="py-12">
                <div className="max-w-md mx-auto">
                    <Card className="p-8 text-center">
                        {status === 'verifying' && (
                            <>
                                <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Verifying your email...
                                </h1>
                                <p className="text-gray-600">
                                    Please wait while we verify your account.
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Email verified!
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    Your account has been verified successfully. Redirecting you to
                                    login...
                                </p>
                                <Button variant="primary" size="md" asChild>
                                    <Link href="/login">Go to Login</Link>
                                </Button>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Verification failed
                                </h1>
                                <p className="text-gray-600 mb-6">{errorMessage}</p>
                                <div className="space-y-3">
                                    <Button
                                        variant="primary"
                                        size="md"
                                        className="w-full"
                                        asChild
                                    >
                                        <Link href="/register/resend-verification">
                                            Request new verification link
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full"
                                        asChild
                                    >
                                        <Link href="/register">Back to registration</Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            </Container>
        </MainLayout>
    );
}
