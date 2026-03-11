'use client';

import { useState } from 'react';
import { useQuery as useConvexQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, XCircle, Building2 } from 'lucide-react';
import type { Id } from '../../../../../../convex/_generated/dataModel';

type TabStatus = 'pending' | 'approved' | 'rejected' | undefined;

export default function AdminInstitutionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabStatus>('pending');
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null,
  });
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const institutions = useConvexQuery(api.adminInstitutions.listInstitutions, {
    status: activeTab,
  });
  const approveMutation = useMutation(api.adminInstitutions.approveInstitution);
  const rejectMutation = useMutation(api.adminInstitutions.rejectInstitution);

  const handleApprove = async (institutionUserId: string) => {
    if (!user) return;
    setActionLoading(institutionUserId);
    try {
      await approveMutation({
        institutionUserId: institutionUserId as Id<'users'>,
        adminUserId: user._id as Id<'users'>,
      });
    } catch (err) {
      console.error('Failed to approve:', err);
    }
    setActionLoading(null);
  };

  const handleReject = async () => {
    if (!user || !rejectModal.userId) return;
    setActionLoading(rejectModal.userId);
    try {
      await rejectMutation({
        institutionUserId: rejectModal.userId as Id<'users'>,
        adminUserId: user._id as Id<'users'>,
        reason: rejectReason,
      });
      setRejectModal({ isOpen: false, userId: null });
      setRejectReason('');
    } catch (err) {
      console.error('Failed to reject:', err);
    }
    setActionLoading(null);
  };

  const tabs: { label: string; value: TabStatus }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'All', value: undefined },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Building2 className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">Institution Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.value
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {!institutions ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : institutions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-gray-50/50">
            No institutions found.
          </div>
        ) : (
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Institution</TableHeaderCell>
                <TableHeaderCell>PIC</TableHeaderCell>
                <TableHeaderCell>Corporate ID</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {institutions.map((inst: any) => (
                <TableRow key={inst._id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900">{inst.institutionName}</p>
                      <p className="text-xs text-gray-500">{inst.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inst.picName}</p>
                      <p className="text-xs text-gray-500">{inst.picEmail}</p>
                      <p className="text-xs text-gray-500">{inst.picPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{inst.corporateIdentityNumber}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {inst.providerType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inst.approvalStatus === 'approved'
                          ? 'success'
                          : inst.approvalStatus === 'rejected'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {inst.approvalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-2">
                      {inst.approvalStatus === 'pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(inst.userId)}
                            disabled={actionLoading === inst.userId}
                            className="bg-green-600 hover:bg-green-700 h-8"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setRejectModal({ isOpen: true, userId: inst.userId })
                            }
                            disabled={actionLoading === inst.userId}
                            className="text-red-600 hover:bg-red-50 h-8"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {inst.approvalStatus === 'rejected' && inst.rejectionReason && (
                        <p className="text-xs text-red-500 italic max-w-[150px] truncate" title={inst.rejectionReason}>
                          Reason: {inst.rejectionReason}
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => {
          setRejectModal({ isOpen: false, userId: null });
          setRejectReason('');
        }}
        title="Reject Institution"
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-600">
            Please provide a reason for rejecting this institution. This will be shown to the institution.
          </p>
          <Textarea
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Invalid corporate identity number, missing website info..."
            rows={4}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={() => {
                setRejectModal({ isOpen: false, userId: null });
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleReject}
              disabled={!rejectReason.trim() || actionLoading !== null}
              className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
            >
              Reject Institution
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
