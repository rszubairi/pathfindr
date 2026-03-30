'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Modal } from '@/components/ui/Modal';
import { format } from 'date-fns';
import Link from 'next/link';
import { Plus, Search, MoreVertical, Edit2, Users, Eye, EyeOff, Trash2, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export default function ScholarshipsPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [itemToFeature, setItemToFeature] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();

  const scholarships = useQuery(
    api.institutionScholarships.listByInstitution,
    user?._id ? { userId: user._id as Id<'users'>, status: statusFilter === 'all' ? undefined : statusFilter } : 'skip'
  );

  const bulkUpdateStatus = useMutation(api.institutionScholarships.bulkUpdateStatus);
  const bulkRemove = useMutation(api.institutionScholarships.bulkRemove);
  const updateStatus = useMutation(api.institutionScholarships.updateForInstitution);
  const removeScholarship = useMutation(api.institutionScholarships.removeForInstitution);
  const createFeaturePayment = useMutation(api.scholarshipFeaturePayments.createPayment);
  const completeFeaturePayment = useMutation(api.scholarshipFeaturePayments.markAsPaid);

  const filteredScholarships = scholarships?.filter((s: any) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredScholarships.map((s: any) => s._id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkUpdateStatus = async (status: 'active' | 'closed' | 'pending') => {
    if (selectedIds.size === 0 || !user?._id) return;
    await bulkUpdateStatus({
      userId: user._id as Id<'users'>,
      ids: Array.from(selectedIds) as Id<'scholarships'>[],
      status
    });
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0 || !user?._id) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} scholarships?`)) {
      await bulkRemove({
        userId: user._id as Id<'users'>,
        ids: Array.from(selectedIds) as Id<'scholarships'>[]
      });
      setSelectedIds(new Set());
    }
  };

  const handleDeleteSingle = async () => {
    if (!itemToDelete || !user?._id) return;
    await removeScholarship({
      userId: user._id as Id<'users'>,
      id: itemToDelete as Id<'scholarships'>
    });
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleFeatureScholarship = async () => {
    if (!itemToFeature || !user?._id) return;
    
    setIsProcessing(true);
    try {
      // 1. Create payment record
      const paymentId = await createFeaturePayment({
        corporateUserId: user._id as Id<'users'>,
        scholarshipId: itemToFeature._id as Id<'scholarships'>,
        amount: 10,
        currency: 'USD'
      });
      
      // 2. Simulate payment completion (in real app, this would happen via Stripe callback)
      await completeFeaturePayment({
        paymentId,
        stripePaymentIntentId: 'simulated_pi_' + Math.random().toString(36).substring(7)
      });
      
      setFeatureModalOpen(false);
      setItemToFeature(null);
      alert(t('dashboard.scholarships.featureSuccessDesc'));
    } catch (error) {
      console.error('Failed to feature scholarship:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'closed': return <Badge variant="danger" className="bg-gray-100 text-gray-800">Closed</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scholarships</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your institution's scholarships</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/scholarships/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex space-x-1">
              {(['all', 'active', 'pending', 'closed'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                    statusFilter === tab 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="w-full sm:w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <div className="bg-primary-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <span className="text-sm text-primary-700 font-medium">
              {selectedIds.size} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleBulkUpdateStatus('active')}>
                Set Active
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleBulkUpdateStatus('closed')}>
                Set Closed
              </Button>
              <Button size="sm" variant="secondary" onClick={handleBulkDelete}>
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-12">
                <Checkbox 
                  checked={filteredScholarships.length > 0 && selectedIds.size === filteredScholarships.length}
                  onChange={handleSelectAll}
                />
              </TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Value</TableHeaderCell>
              <TableHeaderCell>Deadline</TableHeaderCell>
              <TableHeaderCell>Featured</TableHeaderCell>
              <TableHeaderCell className="text-right">Applications</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredScholarships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No scholarships found
                </TableCell>
              </TableRow>
            ) : (
              filteredScholarships.map((scholarship: any) => (
                <TableRow key={scholarship._id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.has(scholarship._id)}
                      onChange={() => handleSelect(scholarship._id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    <Link href={`/dashboard/scholarships/edit?id=${scholarship._id}`} className="hover:text-primary-600">
                      {scholarship.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(scholarship.status)}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {scholarship.currency} {scholarship.value}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {scholarship.deadline ? format(new Date(scholarship.deadline), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {scholarship.isFeatured ? (
                      <Badge variant="success" className="bg-amber-100 text-amber-700 border-amber-200">
                        <Star className="w-3 h-3 mr-1 fill-amber-500" />
                        {t('dashboard.scholarships.isFeatured')}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-gray-500">
                    {scholarship.applicationsCount || 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2 items-center">
                      {!scholarship.isFeatured && scholarship.status === 'active' && (
                        <button 
                          onClick={() => {
                            setItemToFeature(scholarship);
                            setFeatureModalOpen(true);
                          }}
                          className="p-2 text-amber-500 hover:text-amber-600 rounded-md hover:bg-amber-50 transition-colors" 
                          title={t('dashboard.scholarships.featureAction')}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <Link href={`/dashboard/scholarships/applicants?id=${scholarship._id}`} className="p-2 text-gray-400 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors" title="View Applicants">
                        <Users className="w-4 h-4" />
                      </Link>
                      <Link href={`/dashboard/scholarships/edit?id=${scholarship._id}`} className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => {
                          setItemToDelete(scholarship._id);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Scholarship"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this scholarship? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleDeleteSingle}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={featureModalOpen}
        onClose={() => !isProcessing && setFeatureModalOpen(false)}
        title={t('dashboard.scholarships.featureModalTitle')}
      >
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <Star className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              {t('dashboard.scholarships.featureModalDesc')}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Scholarship</span>
              <span className="text-sm font-semibold">{itemToFeature?.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Duration</span>
              <span className="text-sm font-semibold">30 Days</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">{t('dashboard.scholarships.featureModalPrice')}</span>
              <span className="text-lg font-black text-primary-600">USD 10.00</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setFeatureModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFeatureScholarship} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : t('dashboard.scholarships.featureBtn')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
