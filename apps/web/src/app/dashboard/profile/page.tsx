'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Building2, User, Mail, Phone, MapPin, Globe, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import type { Id } from '../../../../../../convex/_generated/dataModel';

const profileSchema = z.object({
  institutionName: z.string().min(2, 'Institution name is required'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  address: z.string().min(5, 'Address is required').optional().or(z.literal('')),
  description: z.string().optional(),
  logoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  picName: z.string().min(2, 'PIC name is required'),
  picEmail: z.string().email('Please enter a valid email'),
  picPhone: z.string().min(8, 'Please enter a valid phone number'),
  providerType: z.enum(['government', 'university', 'corporate', 'ngo', 'foundation', 'individual']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function InstitutionProfilePage() {
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profile = useQuery(
    api.institutionAuth.getInstitutionProfile,
    user?._id ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const updateProfile = useMutation(api.institutionAuth.updateInstitutionProfile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        institutionName: profile.institutionName,
        website: profile.website || '',
        address: profile.address || '',
        description: profile.description || '',
        logoUrl: profile.logoUrl || '',
        picName: profile.picName,
        picEmail: profile.picEmail,
        picPhone: profile.picPhone,
        providerType: profile.providerType as any,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?._id) return;
    setError(null);
    setIsSuccess(false);

    try {
      await updateProfile({
        userId: user._id as Id<'users'>,
        ...data,
      });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (!profile && user?._id) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Institution Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Update your institution details and contact information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Institution Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <Building2 className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Institution Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Institution Name"
              {...register('institutionName')}
              error={errors.institutionName?.message}
              placeholder="Enter name of your institution"
            />

            <Select
              label="Provider Type"
              {...register('providerType')}
              error={errors.providerType?.message}
              options={[
                { label: 'University', value: 'university' },
                { label: 'Government', value: 'government' },
                { label: 'Corporate', value: 'corporate' },
                { label: 'NGO', value: 'ngo' },
                { label: 'Foundation', value: 'foundation' },
                { label: 'Individual', value: 'individual' },
              ]}
            />

            <Input
              label="Website"
              {...register('website')}
              error={errors.website?.message}
              placeholder="https://example.edu"
              icon={<Globe className="w-4 h-4" />}
            />

            <Input
              label="Logo URL"
              {...register('logoUrl')}
              error={errors.logoUrl?.message}
              placeholder="https://example.edu/logo.png"
              icon={<ImageIcon className="w-4 h-4" />}
            />

            <div className="md:col-span-2">
              <Input
                label="Full Address"
                {...register('address')}
                error={errors.address?.message}
                placeholder="123 Education St, Knowledge City, 54321"
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Institution Description"
                {...register('description')}
                error={errors.description?.message}
                placeholder="Tell us about your institution..."
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* PIC Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Person in Charge (PIC)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              {...register('picName')}
              error={errors.picName?.message}
              placeholder="PIC Full Name"
              icon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              {...register('picEmail')}
              error={errors.picEmail?.message}
              placeholder="pic@example.edu"
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              {...register('picPhone')}
              error={errors.picPhone?.message}
              placeholder="+60 12-345 6789"
              icon={<Phone className="w-4 h-4" />}
            />
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-gray-100 pt-6">
          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}
          
          {isSuccess && (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            className="w-full sm:w-auto min-w-[150px]"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
