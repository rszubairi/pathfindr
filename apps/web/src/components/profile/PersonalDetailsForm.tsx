'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { COUNTRIES } from '@/lib/constants';

import { useTranslation } from 'react-i18next';

const personalDetailsSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Please select your gender'),
  nationality: z.string().min(1, 'Nationality is required'),
  country: z.string().min(1, 'Country of residence is required'),
});

type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const { t } = useTranslation();
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
          {t('profile.forms.personalDetails.title')}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {t('profile.forms.personalDetails.subtitle')}
        </p>
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

      <div className="flex justify-between pt-4">
        <div>
          {!isFirstStep && (
            <Button type="button" variant="ghost" onClick={onBack}>
              {t('profile.forms.common.back')}
            </Button>
          )}
        </div>
        <Button type="submit" variant="primary">
          {t('profile.forms.common.next')}
        </Button>
      </div>
    </form>
  );
}
