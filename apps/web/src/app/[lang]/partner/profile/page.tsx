'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UserCircle, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import type { Id } from '@convex/_generated/dataModel';

const profileSchema = z.object({
  personInChargeName: z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function PartnerProfilePage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const profile = useQuery(
    api.partners.getPartnerProfileByUserId,
    user ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const updateProfile = useMutation(api.partners.updatePartnerProfile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        personInChargeName: profile.personInChargeName,
        companyName: profile.companyName ?? '',
        location: profile.location,
        address: profile.address,
        phone: profile.phone,
        website: profile.website ?? '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await updateProfile({
        profileId: profile._id,
        personInChargeName: data.personInChargeName,
        companyName: data.companyName || undefined,
        location: data.location,
        address: data.address,
        phone: data.phone,
        website: data.website || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyCode = () => {
    if (!profile?.partnerCode) return;
    navigator.clipboard.writeText(profile.partnerCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-3">
        <UserCircle className="w-7 h-7 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Partner Profile</h1>
      </div>

      {/* Read-only info */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Account Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{profile.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Partner Type</p>
            <p className="font-medium text-gray-900 capitalize">{profile.partnerType}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <Badge variant="success">Approved</Badge>
          </div>
          <div>
            <p className="text-gray-500">Commission Rate</p>
            <p className="font-semibold text-gray-900">{profile.commissionPercentage ?? 0}%</p>
          </div>
        </div>

        {/* Partner Code */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-gray-500 text-sm mb-2">Your Partner Code</p>
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-xl tracking-widest text-primary-700 bg-primary-50 px-4 py-2 rounded-lg">
              {profile.partnerCode}
            </span>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              {codeCopied ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {codeCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </Card>

      {/* Editable fields */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">Edit Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {profile.partnerType === 'company' && (
            <Input
              label="Company Name"
              {...register('companyName')}
              error={errors.companyName?.message}
            />
          )}

          <Input
            label="Person in Charge Name"
            {...register('personInChargeName')}
            error={errors.personInChargeName?.message}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
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

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving || !isDirty}
              isLoading={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            {saved && <span className="text-sm text-green-600 font-medium">Saved successfully!</span>}
          </div>
        </form>
      </Card>
    </div>
  );
}
