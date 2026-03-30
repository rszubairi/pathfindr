'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'sports', label: 'Sports' },
  { value: 'arts', label: 'Arts & Music' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'community', label: 'Community Service' },
  { value: 'academic_club', label: 'Academic Club' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'other', label: 'Other' },
] as const;

const EDUCATION_LEVELS = [
  { value: 'school', label: 'School' },
  { value: 'college', label: 'College' },
  { value: 'university', label: 'University' },
] as const;

const activitySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Activity name is required'),
  category: z.enum(['sports', 'arts', 'leadership', 'community', 'academic_club', 'cultural', 'other']),
  role: z.string().min(1, 'Role is required'),
  educationLevel: z.enum(['school', 'college', 'university']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
  achievement: z.string().optional(),
});

const formSchema = z.object({
  extracurriculars: z.array(activitySchema),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
  onBack: () => void;
}

export default function ExtracurricularsForm({ data, onNext, onSave, onBack }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      extracurriculars: data.extracurriculars || [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'extracurriculars' });

  const getPayload = (formData: FormData) => ({ extracurriculars: formData.extracurriculars });

  const onSubmit = (formData: FormData) => {
    onNext(getPayload(formData));
  };

  const handleSaveProgress = async () => {
    await handleSubmit(async (formData) => {
      setIsSaving(true);
      try {
        await onSave(getPayload(formData));
      } finally {
        setIsSaving(false);
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Extracurricular Activities</h2>
        <p className="text-gray-600 text-sm mb-6">
          Add activities from school, college, or university — sports, clubs, volunteer work, leadership roles, and more. Include any awards or achievements.
        </p>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="p-4 bg-gray-50 rounded-lg space-y-4 mb-3 border border-gray-100"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Activity {index + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <input type="hidden" {...register(`extracurriculars.${index}.id`)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Activity Name"
              {...register(`extracurriculars.${index}.name`)}
              error={errors.extracurriculars?.[index]?.name?.message}
              placeholder="e.g., Football Team, Chess Club, Student Council"
              required
            />
            <Input
              label="Your Role"
              {...register(`extracurriculars.${index}.role`)}
              error={errors.extracurriculars?.[index]?.role?.message}
              placeholder="e.g., Captain, Member, President"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name={`extracurriculars.${index}.category`}
              render={({ field: f }) => (
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => f.onChange(cat.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        f.value === cat.value
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400 hover:text-primary-600'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Level <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name={`extracurriculars.${index}.educationLevel`}
              render={({ field: f }) => (
                <div className="flex gap-2">
                  {EDUCATION_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => f.onChange(level.value)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        f.value === level.value
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400 hover:text-primary-600'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              {...register(`extracurriculars.${index}.startDate`)}
              error={errors.extracurriculars?.[index]?.startDate?.message}
              placeholder="e.g., Jan 2022"
              required
            />
            <Input
              label="End Date"
              {...register(`extracurriculars.${index}.endDate`)}
              placeholder="e.g., Dec 2023"
              helperText="Leave empty if ongoing"
            />
          </div>

          <Input
            label="Achievement / Award"
            {...register(`extracurriculars.${index}.achievement`)}
            placeholder="e.g., 1st place nationals, Gold medal, Best Speaker Award"
            helperText="Include any recognition, awards, or notable outcomes"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              {...register(`extracurriculars.${index}.description`)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={2}
              placeholder="Brief description of your involvement and impact..."
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            name: '',
            category: 'sports',
            role: '',
            educationLevel: 'school',
            startDate: '',
            endDate: '',
            description: '',
            achievement: '',
          })
        }
        className="w-full py-3 border-dashed border-2 bg-transparent hover:bg-gray-50 text-gray-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Activity
      </Button>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveProgress}
            isLoading={isSaving}
          >
            Save Progress
          </Button>
          <Button type="submit" variant="primary">
            Next
          </Button>
        </div>
      </div>
    </form>
  );
}
