'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, X } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const certificateSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  dateIssued: z.string().min(1, 'Date is required'),
});

const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
});

const achievementsSchema = z.object({
  certificates: z.array(certificateSchema),
  projects: z.array(projectSchema),
});

type AchievementsData = z.infer<typeof achievementsSchema>;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
  onBack: () => void;
}

export default function AchievementsForm({ data, onNext, onSave, onBack }: Props) {
  const { t } = useTranslation();
  const [skills, setSkills] = useState<string[]>(data.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AchievementsData>({
    resolver: zodResolver(achievementsSchema),
    defaultValues: {
      certificates: data.certificates || [],
      projects: data.projects || [],
    },
  });

  const {
    fields: certFields,
    append: addCert,
    remove: removeCert,
  } = useFieldArray({ control, name: 'certificates' });

  const {
    fields: projFields,
    append: addProj,
    remove: removeProj,
  } = useFieldArray({ control, name: 'projects' });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const getFormPayload = (formData: AchievementsData) => ({
    certificates: formData.certificates,
    projects: formData.projects,
    skills,
  });

  const onSubmit = (formData: AchievementsData) => {
    onNext(getFormPayload(formData));
  };

  const handleSaveProgress = async () => {
    await handleSubmit(async (formData) => {
      setIsSaving(true);
      try {
        await onSave(getFormPayload(formData));
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {t('profile.forms.achievements.title')}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {t('profile.forms.achievements.subtitle')}
        </p>
      </div>

      {/* ─── Certificates ─────────────────────────────────── */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          {t('profile.forms.achievements.certificates.title')}
        </h3>
        {certFields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 bg-gray-50 rounded-lg space-y-3 mb-3 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {t('profile.forms.achievements.certificates.entry', {
                  index: index + 1,
                })}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCert(index)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <input type="hidden" {...register(`certificates.${index}.id`)} />
            <Input
              label={t('profile.forms.achievements.certificates.itemTitle')}
              {...register(`certificates.${index}.title`)}
              error={errors.certificates?.[index]?.title?.message}
              placeholder={t('profile.forms.achievements.certificates.placeholder')}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label={t('profile.forms.achievements.certificates.issuer')}
                {...register(`certificates.${index}.issuer`)}
                error={errors.certificates?.[index]?.issuer?.message}
                placeholder="e.g., Amazon Web Services"
                required
              />
              <Input
                label={t('profile.forms.achievements.certificates.dateIssued')}
                type="date"
                {...register(`certificates.${index}.dateIssued`)}
                error={errors.certificates?.[index]?.dateIssued?.message}
                required
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            addCert({
              id: crypto.randomUUID(),
              title: '',
              issuer: '',
              dateIssued: '',
            })
          }
          className="w-full py-3 border-dashed border-2 bg-transparent hover:bg-gray-50 text-gray-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('profile.forms.achievements.certificates.addAnother')}
        </Button>
      </div>

      {/* ─── Projects ─────────────────────────────────────── */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          {t('profile.forms.achievements.projects.title')}
        </h3>
        {projFields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 bg-gray-50 rounded-lg space-y-3 mb-3 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {t('profile.forms.achievements.projects.entry', {
                  index: index + 1,
                })}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProj(index)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <input type="hidden" {...register(`projects.${index}.id`)} />
            <Input
              label={t('profile.forms.achievements.projects.itemTitle')}
              {...register(`projects.${index}.title`)}
              error={errors.projects?.[index]?.title?.message}
              placeholder={t('profile.forms.achievements.projects.placeholder')}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.forms.achievements.projects.description')}{' '}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register(`projects.${index}.description`)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder={t(
                  'profile.forms.achievements.projects.descPlaceholder'
                )}
              />
              {errors.projects?.[index]?.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.projects[index].description?.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label={t('profile.forms.achievements.projects.startDate')}
                type="date"
                {...register(`projects.${index}.startDate`)}
                error={errors.projects?.[index]?.startDate?.message}
                required
              />
              <Input
                label={t('profile.forms.achievements.projects.endDate')}
                type="date"
                {...register(`projects.${index}.endDate`)}
                helperText="Leave empty if ongoing"
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            addProj({
              id: crypto.randomUUID(),
              title: '',
              description: '',
              technologies: [],
              startDate: '',
              endDate: '',
            })
          }
          className="w-full py-3 border-dashed border-2 bg-transparent hover:bg-gray-50 text-gray-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('profile.forms.achievements.projects.addAnother')}
        </Button>
      </div>

      {/* ─── Skills ───────────────────────────────────────── */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          {t('profile.forms.achievements.skills.title')}
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('profile.forms.achievements.skills.placeholder')}
          />
          <Button type="button" variant="secondary" onClick={addSkill} className="font-bold">
            {t('profile.forms.common.add')}
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-primary-900 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
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
