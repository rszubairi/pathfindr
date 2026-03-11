'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../../../convex/_generated/api';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { SearchInput } from '@/components/ui/SearchInput';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Id } from '../../../../../../../../convex/_generated/dataModel';

export default function ApplicantsPage() {
  const params = useParams();
  const id = params.id as Id<'scholarships'>;
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const scholarship = useQuery(api.scholarships.getById, { id });
  const applicants = useQuery(
    api.institutionScholarships.getApplicants,
    user?._id ? { userId: user._id as Id<'users'>, scholarshipId: id } : 'skip'
  );
  
  const updateStatus = useMutation(api.institutionScholarships.updateApplicantStatus);

  const filteredApplicants = applicants?.filter((app: any) => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleStatusChange = async (applicationId: Id<'applications'>, newStatus: string) => {
    if (!user?._id) return;
    try {
      await updateStatus({
        userId: user._id as Id<'users'>,
        applicationId,
        status: newStatus as any,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update application status');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'applied': return 'default';
      case 'under_review': return 'warning';
      case 'shortlisted': return 'primary';
      case 'awarded': return 'success';
      case 'rejected': return 'danger';
      case 'withdrawn': return 'default';
      default: return 'default';
    }
  };

  if (scholarship === undefined || applicants === undefined) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/scholarships" className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="mt-1 text-sm text-gray-500">{scholarship?.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 items-center w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <SearchInput 
                placeholder="Search by name or email..." 
                onSearch={setSearchQuery}
              />
            </div>
            <div className="w-48">
              <Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'applied', label: 'Applied' },
                  { value: 'under_review', label: 'Under Review' },
                  { value: 'shortlisted', label: 'Shortlisted' },
                  { value: 'awarded', label: 'Awarded' },
                  { value: 'rejected', label: 'Rejected' }
                ]}
              />
            </div>
          </div>
          <div className="text-sm text-gray-500 self-center">
            Showing {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''}
          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Applicant Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Applied Date</TableHeaderCell>
              <TableHeaderCell>Current Status</TableHeaderCell>
              <TableHeaderCell>Update Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                  No applicants found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredApplicants.map((app: any) => (
                <TableRow key={app.applicationId}>
                  <TableCell className="font-medium text-gray-900">
                    {app.fullName}
                  </TableCell>
                  <TableCell>
                    <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600">
                      <Mail className="w-3.5 h-3.5" />
                      {app.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {format(new Date(app.appliedAt), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(app.status) as any}>
                      {app.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.applicationId as Id<'applications'>, e.target.value)}
                      className="w-40 py-1"
                      options={[
                        { value: 'applied', label: 'Applied' },
                        { value: 'under_review', label: 'Under Review' },
                        { value: 'shortlisted', label: 'Shortlisted' },
                        { value: 'awarded', label: 'Awarded' },
                        { value: 'rejected', label: 'Rejected' },
                        { value: 'withdrawn', label: 'Withdrawn' }
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
