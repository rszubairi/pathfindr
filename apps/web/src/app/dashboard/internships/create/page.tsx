'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { MapPin, Calendar, Briefcase, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Id } from '@convex/_generated/dataModel';

const internshipSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'remote']),
  deadline: z.string().min(1, 'Deadline is required'),
  salaryRange: z.string().optional(),
  duration: z.string().optional(),
});

type InternshipFormData = z.infer<typeof internshipSchema>;

export default function CreateInternshipPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);

  const createInternship = useMutation(api.internships.create);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InternshipFormData>({
    resolver: zodResolver(internshipSchema),
    defaultValues: {
      type: 'full-time',
    },
  });

  const onSubmit = async (data: InternshipFormData) => {
    setIsSubmitting(true);
    setError(null);

    const filteredRequirements = requirements.filter(r => r.trim() !== '');
    const filteredResponsibilities = responsibilities.filter(r => r.trim() !== '');

    if (filteredRequirements.length === 0 || filteredResponsibilities.length === 0) {
      setError('Please add at least one requirement and one responsibility.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (!user?._id) {
        throw new Error('Please log in again building your internship draft.');
      }

      await createInternship({
        ...data,
        requirements: filteredRequirements,
        responsibilities: filteredResponsibilities,
        userId: user._id as Id<'users'>,
      });
      router.push('/dashboard/internships');
    } catch (err: any) {
      setError(err.message || 'Failed to create internship. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddField = (setter: any, currentFields: string[]) => {
    setter([...currentFields, '']);
  };

  const handleUpdateField = (setter: any, currentFields: string[], index: number, value: string) => {
    const newFields = [...currentFields];
    newFields[index] = value;
    setter(newFields);
  };

  const handleRemoveField = (setter: any, currentFields: string[], index: number) => {
    const newFields = currentFields.filter((_, i) => i !== index);
    if (newFields.length === 0) newFields.push('');
    setter(newFields);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post an Internship</h1>
          <p className="text-gray-500 text-sm">Create a draft listing. RM15 fee applies for publishing.</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-12">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary-600" />
            Basic Information
          </h2>
          <div className="space-y-4">
            <Input
              label="Internship Title"
              placeholder="e.g. Software Engineer Intern"
              {...register('title')}
              error={errors.title?.message}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Job Type"
                options={[
                  { value: 'full-time', label: 'Full-time' },
                  { value: 'part-time', label: 'Part-time' },
                  { value: 'remote', label: 'Remote' },
                ]}
                {...register('type')}
                error={errors.type?.message}
                required
              />
              <Input
                label="Location"
                placeholder="e.g. Kuala Lumpur, Malaysia or Remote"
                {...register('location')}
                error={errors.location?.message}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Salary Range (Optional)"
                placeholder="e.g. RM 1,000 - RM 1,500"
                {...register('salaryRange')}
                error={errors.salaryRange?.message}
              />
              <Input
                label="Duration (Optional)"
                placeholder="e.g. 3-6 months"
                {...register('duration')}
                error={errors.duration?.message}
              />
            </div>
            <Input
              label="Application Deadline"
              type="date"
              {...register('deadline')}
              error={errors.deadline?.message}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition h-32"
                placeholder="Describe the company and the internship role..."
                {...register('description')}
              />
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
            </div>
          </div>
        </Card>

        {/* Requirements */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-600" />
            Requirements
          </h2>
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="e.g. Currently pursuing Computer Science degree"
                  value={req}
                  onChange={(e) => handleUpdateField(setRequirements, requirements, index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField(setRequirements, requirements, index)}
                  className="p-3 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAddField(setRequirements, requirements)}
            >
              Add Requirement
            </Button>
          </div>
        </Card>

        {/* Responsibilities */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-600" />
            Responsibilities
          </h2>
          <div className="space-y-3">
            {responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="e.g. Assist in developing new features for the platform"
                  value={resp}
                  onChange={(e) => handleUpdateField(setResponsibilities, responsibilities, index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField(setResponsibilities, responsibilities, index)}
                  className="p-3 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAddField(setResponsibilities, responsibilities)}
            >
              Add Responsibility
            </Button>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
           <Button variant="secondary" type="button" onClick={() => router.back()}>Cancel</Button>
           <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
             Save as Draft
           </Button>
        </div>
      </form>
    </div>
  );
}
