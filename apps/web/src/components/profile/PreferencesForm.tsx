'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { INTERESTS } from '@/lib/constants';

const preferencesSchema = z.object({
  availability: z.string().optional(),
});

type PreferencesData = z.infer<typeof preferencesSchema>;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext: (data: any) => Promise<void>;
  onBack: () => void;
}

import { useTranslation } from 'react-i18next';

export default function PreferencesForm({ data, onNext, onBack }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markProfileCompleted = useMutation(api.auth.markProfileCompleted);

  const [interests, setInterests] = useState<string[]>(data.interests || []);
  const [interestInput, setInterestInput] = useState('');
  const [countries, setCountries] = useState<string[]>(
    data.preferredCountries || []
  );
  const [countryInput, setCountryInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreferencesData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      availability: data.availability || '',
    },
  });

  const addInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setInterestInput('');
    }
  };

  const addCountry = () => {
    const trimmed = countryInput.trim();
    if (trimmed && !countries.includes(trimmed)) {
      setCountries([...countries, trimmed]);
      setCountryInput('');
    }
  };

  const onSubmit = async (formData: PreferencesData) => {
    if (interests.length === 0) {
      setError('Please add at least one interest');
      return;
    }
    if (countries.length === 0) {
      setError('Please add at least one preferred country');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onNext({
        interests,
        preferredCountries: countries,
        availability: formData.availability || undefined,
      });

      const userId = localStorage.getItem('userId');
      if (userId) {
        await markProfileCompleted({ userId: userId as Id<'users'> });
      }

      router.push('/scholarships');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {t('profile.forms.preferences.title')}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {t('profile.forms.preferences.subtitle')}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* ─── Interests ─────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile.forms.preferences.interests.label')}{' '}
          <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            list="interest-suggestions"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInterest();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('profile.forms.preferences.interests.placeholder')}
          />
          <datalist id="interest-suggestions">
            {INTERESTS.filter((i) => !interests.includes(i)).map((interest) => (
              <option key={interest} value={interest} />
            ))}
          </datalist>
          <Button type="button" variant="secondary" onClick={addInterest}>
            {t('profile.forms.common.add')}
          </Button>
        </div>
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {interest}
                <button
                  type="button"
                  onClick={() =>
                    setInterests(interests.filter((i) => i !== interest))
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── Preferred Countries ───────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('profile.forms.preferences.studyCountries.label')}{' '}
          <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCountry();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t(
              'profile.forms.preferences.studyCountries.placeholder'
            )}
          />
          <Button type="button" variant="secondary" onClick={addCountry}>
            {t('profile.forms.common.add')}
          </Button>
        </div>
        {countries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <span
                key={country}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {country}
                <button
                  type="button"
                  onClick={() =>
                    setCountries(countries.filter((c) => c !== country))
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── Availability ──────────────────────────────────── */}
      <Input
        label={t('profile.forms.preferences.availability.label')}
        {...register('availability')}
        error={errors.availability?.message}
        placeholder={t('profile.forms.preferences.availability.placeholder')}
      />

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onBack}>
          {t('profile.forms.common.back')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting
            ? t('profile.forms.preferences.saving')
            : t('profile.forms.preferences.complete')}
        </Button>
      </div>
    </form>
  );
}
