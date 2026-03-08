'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const personalDetailsSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Please select your gender'),
  nationality: z.string().min(1, 'Nationality is required'),
  country: z.string().min(1, 'Country of residence is required'),
});

type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
}

export default function PersonalDetailsForm({
  data,
  onNext,
  onBack,
  isFirstStep,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDetailsData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: data.personalDetails || {},
  });

  const onSubmit = (formData: PersonalDetailsData) => {
    onNext({ personalDetails: formData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Personal Details
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Let&apos;s start with some basic information about you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date of Birth"
          type="date"
          {...register('dateOfBirth')}
          error={errors.dateOfBirth?.message}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            {...register('gender')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">
              {errors.gender.message}
            </p>
          )}
        </div>

        <Input
          label="Nationality"
          {...register('nationality')}
          error={errors.nationality?.message}
          placeholder="e.g., American, British, Indian"
          required
        />

        <Input
          label="Country of Residence"
          {...register('country')}
          error={errors.country?.message}
          placeholder="e.g., United States, United Kingdom"
          required
        />
      </div>

      <div className="flex justify-between pt-4">
        <div>
          {!isFirstStep && (
            <Button type="button" variant="ghost" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
        <Button type="submit" variant="primary">
          Next
        </Button>
      </div>
    </form>
  );
}
