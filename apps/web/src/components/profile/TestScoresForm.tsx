'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const EXAM_REGISTRATION_LINKS: Record<string, { name: string; url: string; description: string }> = {
  sat: {
    name: 'College Board (SAT)',
    url: 'https://satsuite.collegeboard.org/sat/registration',
    description: 'Register for the SAT exam',
  },
  ielts: {
    name: 'IELTS Official',
    url: 'https://www.ielts.org/book-a-test',
    description: 'Book an IELTS test',
  },
  toefl: {
    name: 'ETS (TOEFL)',
    url: 'https://www.ets.org/toefl/test-takers/ibt/register',
    description: 'Register for TOEFL iBT',
  },
  gre: {
    name: 'ETS (GRE)',
    url: 'https://www.ets.org/gre/test-takers/general-test/register',
    description: 'Register for the GRE',
  },
  gmat: {
    name: 'GMAC (GMAT)',
    url: 'https://www.mba.com/exams/gmat-exam/register',
    description: 'Register for the GMAT',
  },
};

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
  onBack: () => void;
}

function ExamLink({ examKey }: { examKey: string }) {
  const link = EXAM_REGISTRATION_LINKS[examKey];
  if (!link) return null;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 hover:underline mt-1"
    >
      <ExternalLink className="w-3 h-3" />
      {link.description}
    </a>
  );
}

export default function TestScoresForm({ data, onNext, onSave, onBack }: Props) {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TestScoresData>({
    resolver: zodResolver(testScoresSchema),
    defaultValues: data.testScores || {},
  });

  const values = watch();

  const getCleanedData = (formData: TestScoresData) => {
    const cleaned: Record<string, number | undefined> = {};
    for (const [key, value] of Object.entries(formData)) {
      cleaned[key] =
        value === undefined || isNaN(value as number) ? undefined : value;
    }
    return { testScores: cleaned };
  };

  const onSubmit = (formData: TestScoresData) => {
    onNext(getCleanedData(formData));
  };

  const handleSaveProgress = async () => {
    await handleSubmit(async (formData) => {
      setIsSaving(true);
      try {
        await onSave(getCleanedData(formData));
      } finally {
        setIsSaving(false);
      }
    })();
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
        <div>
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
          {!values.sat && <ExamLink examKey="sat" />}
        </div>

        <div>
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
          {!values.ielts && <ExamLink examKey="ielts" />}
        </div>

        <div>
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
          {!values.toefl && <ExamLink examKey="toefl" />}
        </div>

        <div>
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
          {!values.gre && <ExamLink examKey="gre" />}
        </div>

        <div>
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
          {!values.gmat && <ExamLink examKey="gmat" />}
        </div>
      </div>

      {/* Referral links section */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-800 mb-2">
          Don&apos;t have your scores yet?
        </p>
        <p className="text-xs text-blue-600 mb-3">
          Register for these exams through the official providers below:
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(EXAM_REGISTRATION_LINKS).map(([key, link]) => (
            <a
              key={key}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-full text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              {link.name}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div>
          <Button type="button" variant="ghost" onClick={onBack}>
            {t('profile.forms.common.back')}
          </Button>
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
