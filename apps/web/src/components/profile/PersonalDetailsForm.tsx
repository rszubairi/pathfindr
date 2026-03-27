'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Camera, Loader2 } from 'lucide-react';
import { COUNTRIES, COUNTRY_CODES } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

import { useTranslation } from 'react-i18next';

const personalDetailsSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Please select your gender'),
  nationality: z.string().min(1, 'Nationality is required'),
  country: z.string().min(1, 'Country of residence is required'),
  countryCode: z.string().optional(),
  phone: z.string().optional(),
});

type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
}

export default function PersonalDetailsForm({
  data,
  onNext,
  onSave,
  onBack,
  isFirstStep,
}: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveProfileImage = useMutation(api.storage.saveProfileImage);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDetailsData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      ...(data.personalDetails || {}),
      countryCode: data.personalDetails?.countryCode || '+60',
      phone: data.personalDetails?.phone || '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // Show preview immediately
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const { storageId } = await result.json();
      await saveProfileImage({
        userId: userId as Id<'users'>,
        storageId,
      });
    } catch (err) {
      console.error('Failed to upload image:', err);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentImageUrl = previewUrl || (user as any)?.profileImageUrl;

  const onSubmit = (formData: PersonalDetailsData) => {
    onNext({ personalDetails: formData });
  };

  const handleSaveProgress = async () => {
    await handleSubmit(async (formData) => {
      setIsSaving(true);
      try {
        await onSave({ personalDetails: formData });
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {t('profile.forms.personalDetails.title')}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {t('profile.forms.personalDetails.subtitle')}
        </p>
      </div>

      {/* ─── Profile Picture ───────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative group"
          disabled={uploading}
        >
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary-400 transition-colors">
            {currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold">
                {user?.fullName?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <p className="text-xs text-gray-500">Click to upload profile photo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('profile.forms.personalDetails.dateOfBirth')}
          type="date"
          {...register('dateOfBirth')}
          error={errors.dateOfBirth?.message}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('profile.forms.personalDetails.gender.label')}{' '}
            <span className="text-red-500">*</span>
          </label>
          <select
            {...register('gender')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">
              {t('profile.forms.personalDetails.gender.placeholder')}
            </option>
            <option value="male">
              {t('profile.forms.personalDetails.gender.male')}
            </option>
            <option value="female">
              {t('profile.forms.personalDetails.gender.female')}
            </option>
            <option value="other">
              {t('profile.forms.personalDetails.gender.other')}
            </option>
            <option value="prefer-not-to-say">
              {t('profile.forms.personalDetails.gender.preferNotToSay')}
            </option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        <div className="relative">
          <Input
            label={t('profile.forms.personalDetails.nationality.label')}
            {...register('nationality')}
            error={errors.nationality?.message}
            placeholder={t(
              'profile.forms.personalDetails.nationality.placeholder'
            )}
            required
            list="nationality-list"
          />
          <datalist id="nationality-list">
            {COUNTRIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div className="relative">
          <Input
            label={t('profile.forms.personalDetails.country.label')}
            {...register('country')}
            error={errors.country?.message}
            placeholder={t('profile.forms.personalDetails.country.placeholder')}
            required
            list="country-list"
          />
          <datalist id="country-list">
            {COUNTRIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      {/* ─── Phone Number ────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <div className="flex gap-2">
          <select
            {...register('countryCode')}
            className="w-[140px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            {COUNTRY_CODES.map((cc) => (
              <option key={`${cc.code}-${cc.country}`} value={cc.code}>
                {cc.code} {cc.country}
              </option>
            ))}
          </select>
          <Input
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="123456789"
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div>
          {!isFirstStep && (
            <Button type="button" variant="ghost" onClick={onBack}>
              {t('profile.forms.common.back')}
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveProgress}
            isLoading={isSaving}
          >
            {t('profile.forms.common.saveProgress', { defaultValue: 'Save Progress' })}
          </Button>
          <Button type="submit" variant="primary">
            {t('profile.forms.common.next')}
          </Button>
        </div>
      </div>
    </form>
  );
}
