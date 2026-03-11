'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/components/layout/MainLayout';
import { Building2 } from 'lucide-react';

const providerTypeOptions = [
  { value: 'university', label: 'University' },
  { value: 'government', label: 'Government' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'ngo', label: 'NGO' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'individual', label: 'Individual' },
];

const registerSchema = z
  .object({
    institutionName: z.string().min(2, 'Institution name must be at least 2 characters'),
    corporateIdentityNumber: z.string().min(1, 'Corporate identity number is required'),
    providerType: z.enum(['government', 'university', 'corporate', 'ngo', 'foundation', 'individual'], {
      required_error: 'Please select institution type',
    }),
    picName: z.string().min(2, 'PIC name must be at least 2 characters'),
    picEmail: z.string().email('Please enter a valid PIC email'),
    picPhone: z.string().min(10, 'PIC phone must be at least 10 digits'),
    email: z.string().email('Please enter a valid admin email'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function InstitutionRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerInstitution = useAction(api.institutionAuthActions.registerInstitution);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      providerType: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await registerInstitution({
        email: data.email,
        password: data.password,
        phone: data.phone,
        institutionName: data.institutionName,
        corporateIdentityNumber: data.corporateIdentityNumber,
        picName: data.picName,
        picEmail: data.picEmail,
        picPhone: data.picPhone,
        providerType: data.providerType,
        website: data.website || undefined,
      });
      router.push('/register/institution/pending');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Container className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Register your institution
            </h1>
            <p className="text-gray-600">
              List and manage scholarships on Pathfindr for students worldwide
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Institution Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Institution Details</h3>
                <div className="space-y-4">
                  <Input
                    label="Institution Name"
                    placeholder="e.g. University of Technology"
                    {...register('institutionName')}
                    error={errors.institutionName?.message}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Corporate Identity Number"
                      placeholder="e.g. REG-2024-001"
                      {...register('corporateIdentityNumber')}
                      error={errors.corporateIdentityNumber?.message}
                      required
                    />

                    <Select
                      label="Institution Type"
                      options={providerTypeOptions}
                      placeholder="Select type"
                      {...register('providerType')}
                      error={errors.providerType?.message}
                      required
                    />
                  </div>

                  <Input
                    label="Website"
                    type="url"
                    placeholder="https://www.example.edu"
                    {...register('website')}
                    error={errors.website?.message}
                  />
                </div>
              </div>

              {/* Person in Charge */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Person in Charge (PIC)</h3>
                <p className="text-sm text-gray-500 mb-4">
                  This person will be contacted for verification purposes.
                </p>
                <div className="space-y-4">
                  <Input
                    label="PIC Full Name"
                    placeholder="Enter full name"
                    {...register('picName')}
                    error={errors.picName?.message}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="PIC Email"
                      type="email"
                      placeholder="pic@university.edu"
                      {...register('picEmail')}
                      error={errors.picEmail?.message}
                      required
                    />

                    <Input
                      label="PIC Phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...register('picPhone')}
                      error={errors.picPhone?.message}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Admin Account */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Account</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Admin Email"
                      type="email"
                      placeholder="admin@university.edu"
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
                  </div>

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
                {isSubmitting ? 'Registering...' : 'Register Institution'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
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
