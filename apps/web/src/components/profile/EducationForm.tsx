'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { UNIVERSITIES, FIELDS_OF_STUDY } from '@/lib/constants';

import { useTranslation } from 'react-i18next';

const educationItemSchema = z.object({
  id: z.string(),
  institutionName: z.string().min(1, 'Institution name is required'),
  qualificationTitle: z.string().min(1, 'Qualification is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  grade: z.string().optional(),
  gpa: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(0).max(4.0).optional()
  ),
});

const educationSchema = z.object({
  education: z
    .array(educationItemSchema)
    .min(1, 'At least one education entry is required'),
});

type EducationData = z.infer<typeof educationSchema>;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
  onBack: () => void;
}

const emptyEducation = () => ({
  id: crypto.randomUUID(),
  institutionName: '',
  qualificationTitle: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  grade: '',
  gpa: undefined as number | undefined,
});

export default function EducationForm({ data, onNext, onSave, onBack }: Props) {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EducationData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education:
        data.education?.length > 0 ? data.education : [emptyEducation()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const onSubmit = (formData: EducationData) => {
    onNext({ education: formData.education });
  };

  const handleSaveProgress = async () => {
    await handleSubmit(async (formData) => {
      setIsSaving(true);
      try {
        await onSave({ education: formData.education });
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {t('profile.forms.education.title')}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {t('profile.forms.education.subtitle')}
        </p>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">
              {t('profile.forms.education.entry', { index: index + 1 })}
            </h3>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <input type="hidden" {...register(`education.${index}.id`)} />

          <div className="relative">
            <Input
              label={t('profile.forms.education.institution.label')}
              {...register(`education.${index}.institutionName`)}
              error={errors.education?.[index]?.institutionName?.message}
              placeholder={t('profile.forms.education.institution.placeholder')}
              required
              list={`uni-list-${index}`}
            />
            <datalist id={`uni-list-${index}`}>
              {UNIVERSITIES.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.forms.education.qualification.label')}{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                {...register(`education.${index}.qualificationTitle`)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">
                  {t('profile.forms.education.qualification.placeholder')}
                </option>
                <option value="High School Diploma">
                  {t('profile.forms.education.qualifications.highSchool')}
                </option>
                <option value="Associate Degree">
                  {t('profile.forms.education.qualifications.associate')}
                </option>
                <option value="Bachelor of Arts">
                  {t('profile.forms.education.qualifications.bachelorArts')}
                </option>
                <option value="Bachelor of Science">
                  {t('profile.forms.education.qualifications.bachelorScience')}
                </option>
                <option value="Bachelor of Engineering">
                  {t('profile.forms.education.qualifications.bachelorEng')}
                </option>
                <option value="Master of Arts">
                  {t('profile.forms.education.qualifications.masterArts')}
                </option>
                <option value="Master of Science">
                  {t('profile.forms.education.qualifications.masterScience')}
                </option>
                <option value="MBA">
                  {t('profile.forms.education.qualifications.mba')}
                </option>
                <option value="PhD">
                  {t('profile.forms.education.qualifications.phd')}
                </option>
                <option value="Other">{t('profile.forms.common.other')}</option>
              </select>
              {errors.education?.[index]?.qualificationTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.education[index].qualificationTitle?.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                label={t('profile.forms.education.fieldOfStudy.label')}
                {...register(`education.${index}.fieldOfStudy`)}
                error={errors.education?.[index]?.fieldOfStudy?.message}
                placeholder={t(
                  'profile.forms.education.fieldOfStudy.placeholder'
                )}
                required
                list={`field-list-${index}`}
              />
              <datalist id={`field-list-${index}`}>
                {FIELDS_OF_STUDY.map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
            </div>

            <Input
              label={t('profile.forms.education.startDate')}
              type="date"
              {...register(`education.${index}.startDate`)}
              error={errors.education?.[index]?.startDate?.message}
              required
            />

            <Input
              label={t('profile.forms.education.endDate.label')}
              type="date"
              {...register(`education.${index}.endDate`)}
              helperText={t('profile.forms.education.endDate.helper')}
            />

            <Input
              label={t('profile.forms.education.grade.label')}
              {...register(`education.${index}.grade`)}
              placeholder={t('profile.forms.education.grade.placeholder')}
            />

            <Input
              label={t('profile.forms.education.gpa.label')}
              type="number"
              step="0.01"
              {...register(`education.${index}.gpa`, {
                setValueAs: (v) =>
                  v === '' || v === undefined ? undefined : parseFloat(v),
              })}
              error={errors.education?.[index]?.gpa?.message}
              placeholder={t('profile.forms.education.gpa.placeholder')}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        onClick={() => append(emptyEducation())}
        className="w-full py-4 border-dashed border-2 bg-transparent hover:bg-gray-50 text-gray-600 font-bold"
      >
        <Plus className="w-5 h-5 mr-2" />
        {t('profile.forms.education.addAnother')}
      </Button>

      {errors.education?.root && (
        <p className="text-sm text-red-600">{errors.education.root.message}</p>
      )}

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
