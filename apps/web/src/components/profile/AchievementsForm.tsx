'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, X } from 'lucide-react';

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
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function AchievementsForm({ data, onNext, onBack }: Props) {
  const [skills, setSkills] = useState<string[]>(data.skills || []);
  const [skillInput, setSkillInput] = useState('');

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

  const onSubmit = (formData: AchievementsData) => {
    onNext({
      certificates: formData.certificates,
      projects: formData.projects,
      skills,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Achievements & Skills
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Showcase your certificates, projects, and skills. All sections are
          optional.
        </p>
      </div>

      {/* ─── Certificates ─────────────────────────────────── */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Certificates</h3>
        {certFields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 bg-gray-50 rounded-lg space-y-3 mb-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Certificate {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCert(index)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <input type="hidden" {...register(`certificates.${index}.id`)} />
            <Input
              label="Certificate Title"
              {...register(`certificates.${index}.title`)}
              error={errors.certificates?.[index]?.title?.message}
              placeholder="e.g., AWS Solutions Architect"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Issuer"
                {...register(`certificates.${index}.issuer`)}
                error={errors.certificates?.[index]?.issuer?.message}
                placeholder="e.g., Amazon Web Services"
                required
              />
              <Input
                label="Date Issued"
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
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      {/* ─── Projects ─────────────────────────────────────── */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          Academic / Personal Projects
        </h3>
        {projFields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 bg-gray-50 rounded-lg space-y-3 mb-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Project {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProj(index)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <input type="hidden" {...register(`projects.${index}.id`)} />
            <Input
              label="Project Title"
              {...register(`projects.${index}.title`)}
              error={errors.projects?.[index]?.title?.message}
              placeholder="e.g., AI-Powered Scholarship Matcher"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register(`projects.${index}.description`)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Briefly describe the project and your role"
              />
              {errors.projects?.[index]?.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.projects[index].description?.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Start Date"
                type="date"
                {...register(`projects.${index}.startDate`)}
                error={errors.projects?.[index]?.startDate?.message}
                required
              />
              <Input
                label="End Date"
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
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* ─── Skills ───────────────────────────────────────── */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Skills</h3>
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
            placeholder="Type a skill and press Enter (e.g., Python, Leadership)"
          />
          <Button type="button" variant="secondary" onClick={addSkill}>
            Add
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-primary-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary">
          Next
        </Button>
      </div>
    </form>
  );
}
