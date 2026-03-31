'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Id } from '@convex/_generated/dataModel';

function EditScholarshipContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const id = searchParams.get('id') as Id<'scholarships'> | null;

  const scholarship = useQuery(api.scholarships.getById, id ? { id } : 'skip');
  const updateScholarship = useMutation(api.institutionScholarships.updateForInstitution);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    value: '',
    currency: 'MYR',
    deadline: '',
    status: 'pending' as 'pending' | 'active' | 'closed',
    eligibleFields: '',
    eligibleCountries: '',
    description: '',
    applicationUrl: '',
    eligibilityCriteria: '',
  });

  // Populate form data once scholarship is loaded
  useEffect(() => {
    if (scholarship) {
      setFormData({
        name: scholarship.name || '',
        value: scholarship.value?.toString() || '',
        currency: scholarship.currency || 'MYR',
        deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : '',
        status: scholarship.status as 'pending' | 'active' | 'closed',
        eligibleFields: scholarship.eligibleFields?.join(', ') || '',
        eligibleCountries: scholarship.eligibleCountries?.join(', ') || '',
        description: scholarship.description || '',
        applicationUrl: scholarship.applicationUrl || '',
        eligibilityCriteria: typeof scholarship.eligibilityCriteria === 'object' 
          ? scholarship.eligibilityCriteria?.text || JSON.stringify(scholarship.eligibilityCriteria) 
          : scholarship.eligibilityCriteria || '',
      });
    }
  }, [scholarship]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    setIsLoading(true);
    setError('');

    try {
      if (!id) throw new Error('No scholarship ID provided');
      await updateScholarship({
        userId: user._id as Id<'users'>,
        id,
        name: formData.name,
        value: parseFloat(formData.value),
        currency: formData.currency,
        deadline: new Date(formData.deadline).toISOString(),
        eligibleFields: formData.eligibleFields.split(',').map(s => s.trim()).filter(Boolean),
        eligibleCountries: formData.eligibleCountries.split(',').map(s => s.trim()).filter(Boolean),
        description: formData.description,
        applicationUrl: formData.applicationUrl,
        eligibilityCriteria: { text: formData.eligibilityCriteria },
        status: formData.status,
      });

      router.push('/dashboard/scholarships');
    } catch (err: any) {
      setError(err.message || 'Failed to update scholarship');
      setIsLoading(false);
    }
  };

  if (scholarship === undefined) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (scholarship === null) {
    return (
      <div className="text-center py-20 text-gray-500">
        Scholarship not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/scholarships" className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Scholarship</h1>
          <p className="mt-1 text-sm text-gray-500">Update details for {scholarship.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Details</h3>
              
              <Input
                label="Scholarship Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Value"
                  name="value"
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.value}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  options={[
                    { value: 'MYR', label: 'MYR' },
                    { value: 'USD', label: 'USD' },
                    { value: 'GBP', label: 'GBP' },
                    { value: 'EUR', label: 'EUR' },
                    { value: 'AUD', label: 'AUD' },
                  ]}
                />
              </div>

              <Input
                label="Application Deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                required
              />

              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'pending', label: 'Pending (Draft)' },
                  { value: 'active', label: 'Active (Published)' },
                  { value: 'closed', label: 'Closed' },
                ]}
              />
              
              <Input
                label="Application URL (Optional)"
                name="applicationUrl"
                type="url"
                placeholder="https://"
                value={formData.applicationUrl}
                onChange={handleChange}
                helperText="If provided, users will apply on this external website."
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Eligibility & Requirements</h3>
              
              <Input
                label="Eligible Fields of Study"
                name="eligibleFields"
                placeholder="Engineering, Medicine, Arts (comma separated)"
                value={formData.eligibleFields}
                onChange={handleChange}
                required
              />

              <Input
                label="Eligible Countries"
                name="eligibleCountries"
                placeholder="Malaysia, Singapore, Global (comma separated)"
                value={formData.eligibleCountries}
                onChange={handleChange}
                required
              />

              <Textarea
                label="Short Description"
                name="description"
                rows={3}
                placeholder="Briefly describe what this scholarship covers..."
                value={formData.description}
                onChange={handleChange}
                required
              />

              <Textarea
                label="Full Eligibility Criteria (Optional)"
                name="eligibilityCriteria"
                rows={4}
                placeholder="Detail the specific requirements..."
                value={formData.eligibilityCriteria}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
            <Link href="/dashboard/scholarships">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditScholarshipPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" /></div>}>
      <EditScholarshipContent />
    </Suspense>
  );
}
