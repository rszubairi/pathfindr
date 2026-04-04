'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/components/layout/MainLayout';
import { Handshake } from 'lucide-react';

const partnerSchema = z.object({
  partnerType: z.enum(['individual', 'company']),
  companyName: z.string().optional(),
  personInChargeName: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  email: z.string().email('Please enter a valid email address'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
}).refine(
  (data) => data.partnerType === 'individual' || (data.companyName && data.companyName.length >= 2),
  { message: 'Company name is required for company registrations', path: ['companyName'] }
);

type PartnerFormData = z.infer<typeof partnerSchema>;

export default function RegisterPartnerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registerPartner = useAction(api.partnerActions.registerPartner);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: { partnerType: 'individual' },
  });

  const partnerType = watch('partnerType');

  const onSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await registerPartner({
        partnerType: data.partnerType,
        companyName: data.companyName || undefined,
        personInChargeName: data.personInChargeName,
        location: data.location,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website || undefined,
      });
      setSuccess(true);
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <MainLayout>
        <Container className="py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for applying to become a Pathfindr partner. Our team will review your
              application and contact you at the email you provided. If approved, you will receive
              your account credentials and partner code via email.
            </p>
            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Return to Home
            </Link>
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="py-8 sm:py-16">
        <div className="max-w-lg mx-auto px-1 sm:px-0">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Become a Partner
            </h1>
            <p className="text-gray-600">
              Register as a Pathfindr partner and earn commission for every student you refer.
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Partner Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['individual', 'company'] as const).map((type) => (
                    <label
                      key={type}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        partnerType === type
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={type}
                        {...register('partnerType')}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {partnerType === 'company' && (
                <Input
                  label="Company Name"
                  placeholder="e.g. ABC Education Consultancy"
                  {...register('companyName')}
                  error={errors.companyName?.message}
                  required
                />
              )}

              <Input
                label="Person in Charge Name"
                placeholder="Full name of primary contact"
                {...register('personInChargeName')}
                error={errors.personInChargeName?.message}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="contact@example.com"
                {...register('email')}
                error={errors.email?.message}
                helperText="This will be your login email if approved"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+60 12-345 6789"
                {...register('phone')}
                error={errors.phone?.message}
                required
              />

              <Input
                label="Location"
                placeholder="e.g. Kuala Lumpur, Malaysia"
                {...register('location')}
                error={errors.location?.message}
                required
              />

              <Input
                label="Full Address"
                placeholder="Street, city, state, postcode"
                {...register('address')}
                error={errors.address?.message}
                required
              />

              <Input
                label="Website (optional)"
                type="url"
                placeholder="https://www.example.com"
                {...register('website')}
                error={errors.website?.message}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">What happens next?</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Our team will review your application</li>
                  <li>We'll contact you to discuss the partnership</li>
                  <li>Upon approval, you'll receive login credentials and your unique partner code</li>
                  <li>Share your partner code with students to track referrals and earnings</li>
                </ol>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Submitting application...' : 'Submit Partner Application'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already a partner?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
              {' · '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Register as a student
              </Link>
            </p>
          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}
