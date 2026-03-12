'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import { useTranslation } from 'react-i18next';

const testScoresSchema = z.object({
  sat: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(400).max(1600).optional()
  ),
  ielts: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(0).max(9).optional()
  ),
  toefl: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(0).max(120).optional()
  ),
  gre: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(260).max(340).optional()
  ),
  gmat: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(200).max(800).optional()
  ),
});

type TestScoresData = z.infer<typeof testScoresSchema>;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function TestScoresForm({ data, onNext, onBack }: Props) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestScoresData>({
    resolver: zodResolver(testScoresSchema),
    defaultValues: data.testScores || {},
  });

  const onSubmit = (formData: TestScoresData) => {
    // Clean undefined values
    const cleaned: Record<string, number | undefined> = {};
    for (const [key, value] of Object.entries(formData)) {
      cleaned[key] =
        value === undefined || isNaN(value as number) ? undefined : value;
    }
    onNext({ testScores: cleaned });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {t('profile.forms.testScores.title')}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {t('profile.forms.testScores.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t('profile.forms.testScores.sat.label')}
          type="number"
          {...register('sat', {
            setValueAs: (v) =>
              v === '' || v === undefined ? undefined : parseInt(v),
          })}
          error={errors.sat?.message}
          placeholder={t('profile.forms.testScores.sat.placeholder')}
          helperText={t('profile.forms.testScores.sat.helper')}
        />

        <Input
          label={t('profile.forms.testScores.ielts.label')}
          type="number"
          step="0.5"
          {...register('ielts', {
            setValueAs: (v) =>
              v === '' || v === undefined ? undefined : parseFloat(v),
          })}
          error={errors.ielts?.message}
          placeholder={t('profile.forms.testScores.ielts.placeholder')}
          helperText={t('profile.forms.testScores.ielts.helper')}
        />

        <Input
          label={t('profile.forms.testScores.toefl.label')}
          type="number"
          {...register('toefl', {
            setValueAs: (v) =>
              v === '' || v === undefined ? undefined : parseInt(v),
          })}
          error={errors.toefl?.message}
          placeholder={t('profile.forms.testScores.toefl.placeholder')}
          helperText={t('profile.forms.testScores.toefl.helper')}
        />

        <Input
          label={t('profile.forms.testScores.gre.label')}
          type="number"
          {...register('gre', {
            setValueAs: (v) =>
              v === '' || v === undefined ? undefined : parseInt(v),
          })}
          error={errors.gre?.message}
          placeholder={t('profile.forms.testScores.gre.placeholder')}
          helperText={t('profile.forms.testScores.gre.helper')}
        />

        <Input
          label={t('profile.forms.testScores.gmat.label')}
          type="number"
          {...register('gmat', {
            setValueAs: (v) =>
              v === '' || v === undefined ? undefined : parseInt(v),
          })}
          error={errors.gmat?.message}
          placeholder={t('profile.forms.testScores.gmat.placeholder')}
          helperText={t('profile.forms.testScores.gmat.helper')}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onBack}>
          {t('profile.forms.common.back')}
        </Button>
        <Button type="submit" variant="primary">
          {t('profile.forms.common.next')}
        </Button>
      </div>
    </form>
  );
}
