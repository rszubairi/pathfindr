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

const preferencesSchema = z.object({
  availability: z.string().optional(),
});

type PreferencesData = z.infer<typeof preferencesSchema>;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function PreferencesForm({ data, onBack }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upsertProfile = useMutation(api.profiles.upsert);
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
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Please log in again to continue');

      const profilePayload = {
        userId: userId as Id<'users'>,
        dateOfBirth: data.personalDetails?.dateOfBirth,
        gender: data.personalDetails?.gender,
        nationality: data.personalDetails?.nationality,
        country: data.personalDetails?.country,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        education: (data.education || []).map((edu: any) => ({
          id: edu.id,
          institutionName: edu.institutionName,
          qualificationTitle: edu.qualificationTitle,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: edu.startDate,
          endDate: edu.endDate || undefined,
          grade: edu.grade || undefined,
          gpa: edu.gpa ? Number(edu.gpa) : undefined,
        })),
        testScores: {
          sat: data.testScores?.sat ? Number(data.testScores.sat) : undefined,
          ielts: data.testScores?.ielts
            ? Number(data.testScores.ielts)
            : undefined,
          toefl: data.testScores?.toefl
            ? Number(data.testScores.toefl)
            : undefined,
          gre: data.testScores?.gre ? Number(data.testScores.gre) : undefined,
          gmat: data.testScores?.gmat
            ? Number(data.testScores.gmat)
            : undefined,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        certificates: (data.certificates || []).map((cert: any) => ({
          id: cert.id,
          title: cert.title,
          issuer: cert.issuer,
          dateIssued: cert.dateIssued,
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projects: (data.projects || []).map((proj: any) => ({
          id: proj.id,
          title: proj.title,
          description: proj.description,
          technologies: proj.technologies || [],
          startDate: proj.startDate,
          endDate: proj.endDate || undefined,
        })),
        skills: data.skills || [],
        interests,
        preferredCountries: countries,
        availability: formData.availability || undefined,
      };

      await upsertProfile(profilePayload);
      await markProfileCompleted({ userId: userId as Id<'users'> });

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
          Career Preferences
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Tell us about your interests so we can match you with the right
          scholarships
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
          Interests <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInterest();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Technology, Healthcare, Education"
          />
          <Button type="button" variant="secondary" onClick={addInterest}>
            Add
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
          Preferred Study Countries <span className="text-red-500">*</span>
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
            placeholder="e.g., United States, United Kingdom, Germany"
          />
          <Button type="button" variant="secondary" onClick={addCountry}>
            Add
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
        label="When are you planning to start?"
        {...register('availability')}
        error={errors.availability?.message}
        placeholder="e.g., Fall 2026, January 2027, Immediately"
      />

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Saving profile...' : 'Complete Profile'}
        </Button>
      </div>
    </form>
  );
}
