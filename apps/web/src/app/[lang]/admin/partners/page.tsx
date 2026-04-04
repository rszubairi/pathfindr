'use client';

import { useState } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, XCircle, Handshake, Percent } from 'lucide-react';
import type { Id } from '@convex/_generated/dataModel';

type TabStatus = 'pending' | 'approved' | 'rejected' | undefined;

export default function AdminPartnersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabStatus>('pending');
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; profileId: string | null }>({
    isOpen: false,
    profileId: null,
  });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; profileId: string | null }>({
    isOpen: false,
    profileId: null,
  });
  const [commissionModal, setCommissionModal] = useState<{ isOpen: boolean; profileId: string | null }>({
    isOpen: false,
    profileId: null,
  });
  const [commission, setCommission] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const partners = useQuery(api.adminPartners.listPartners, { status: activeTab });
  const approvePartner = useAction(api.partnerActions.approvePartner);
  const rejectPartner = useAction(api.partnerActions.rejectPartner);
  const updateCommission = useMutation(api.adminPartners.updateCommission);

  const handleApprove = async () => {
    if (!user || !approveModal.profileId) return;
    const pct = parseFloat(commission);
    if (isNaN(pct) || pct < 0 || pct > 100) return;
    setActionLoading(approveModal.profileId);
    try {
      await approvePartner({
        partnerProfileId: approveModal.profileId as Id<'partnerProfiles'>,
        adminUserId: user._id as Id<'users'>,
        commissionPercentage: pct,
      });
      setApproveModal({ isOpen: false, profileId: null });
      setCommission('');
    } catch (err) {
      console.error('Failed to approve partner:', err);
    }
    setActionLoading(null);
  };

  const handleReject = async () => {
    if (!user || !rejectModal.profileId) return;
    setActionLoading(rejectModal.profileId);
    try {
      await rejectPartner({
        partnerProfileId: rejectModal.profileId as Id<'partnerProfiles'>,
        adminUserId: user._id as Id<'users'>,
        reason: rejectReason || undefined,
      });
      setRejectModal({ isOpen: false, profileId: null });
      setRejectReason('');
    } catch (err) {
      console.error('Failed to reject partner:', err);
    }
    setActionLoading(null);
  };

  const handleUpdateCommission = async () => {
    if (!user || !commissionModal.profileId) return;
    const pct = parseFloat(commission);
    if (isNaN(pct) || pct < 0 || pct > 100) return;
    setActionLoading(commissionModal.profileId);
    try {
      await updateCommission({
        profileId: commissionModal.profileId as Id<'partnerProfiles'>,
        adminUserId: user._id as Id<'users'>,
        commissionPercentage: pct,
      });
      setCommissionModal({ isOpen: false, profileId: null });
      setCommission('');
    } catch (err) {
      console.error('Failed to update commission:', err);
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
        <Handshake className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
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
        {!partners ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : partners.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-gray-50/50">
            No partners found.
          </div>
        ) : (
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Partner</TableHeaderCell>
                <TableHeaderCell>Contact</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Partner Code</TableHeaderCell>
                <TableHeaderCell>Commission</TableHeaderCell>
                <TableHeaderCell>Referrals</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {partners.map((partner: any) => (
                <TableRow key={partner._id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {partner.companyName || partner.personInChargeName}
                      </p>
                      {partner.companyName && (
                        <p className="text-xs text-gray-500">PIC: {partner.personInChargeName}</p>
                      )}
                      <p className="text-xs text-gray-400">{partner.location}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-900">{partner.email}</p>
                      <p className="text-xs text-gray-500">{partner.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {partner.partnerType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {partner.partnerCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    {partner.commissionPercentage != null ? (
                      <span className="text-sm font-semibold text-gray-900">
                        {partner.commissionPercentage}%
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-gray-700">{partner.referralCount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        partner.approvalStatus === 'approved'
                          ? 'success'
                          : partner.approvalStatus === 'rejected'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {partner.approvalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-2">
                      {partner.approvalStatus === 'pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setApproveModal({ isOpen: true, profileId: partner._id });
                              setCommission('');
                            }}
                            disabled={actionLoading === partner._id}
                            className="bg-green-600 hover:bg-green-700 h-8"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRejectModal({ isOpen: true, profileId: partner._id })}
                            disabled={actionLoading === partner._id}
                            className="text-red-600 hover:bg-red-50 h-8"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {partner.approvalStatus === 'approved' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCommissionModal({ isOpen: true, profileId: partner._id });
                            setCommission(String(partner.commissionPercentage ?? ''));
                          }}
                          disabled={actionLoading === partner._id}
                          className="h-8"
                        >
                          <Percent className="w-3.5 h-3.5 mr-1" />
                          Commission
                        </Button>
                      )}
                      {partner.approvalStatus === 'rejected' && partner.rejectionReason && (
                        <p className="text-xs text-red-500 italic max-w-[150px] truncate" title={partner.rejectionReason}>
                          {partner.rejectionReason}
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

      {/* Approve Modal */}
      <Modal
        isOpen={approveModal.isOpen}
        onClose={() => { setApproveModal({ isOpen: false, profileId: null }); setCommission(''); }}
        title="Approve Partner"
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-600">
            Set the commission percentage for this partner before approving. An email with their
            login credentials and partner code will be sent automatically.
          </p>
          <Input
            label="Commission Percentage"
            type="number"
            min={0}
            max={100}
            step={0.5}
            placeholder="e.g. 10"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            helperText="Percentage of subscription revenue earned per paying referred student"
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => { setApproveModal({ isOpen: false, profileId: null }); setCommission(''); }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleApprove}
              disabled={!commission || actionLoading !== null}
              className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
            >
              Approve & Send Credentials
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => { setRejectModal({ isOpen: false, profileId: null }); setRejectReason(''); }}
        title="Reject Partner Application"
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-600">
            Optionally provide a reason for rejection. This will be included in the email sent to the applicant.
          </p>
          <Textarea
            label="Rejection Reason (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Incomplete information, unable to verify business details..."
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => { setRejectModal({ isOpen: false, profileId: null }); setRejectReason(''); }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleReject}
              disabled={actionLoading !== null}
              className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
            >
              Reject Application
            </Button>
          </div>
        </div>
      </Modal>

      {/* Update Commission Modal */}
      <Modal
        isOpen={commissionModal.isOpen}
        onClose={() => { setCommissionModal({ isOpen: false, profileId: null }); setCommission(''); }}
        title="Update Commission Rate"
      >
        <div className="space-y-4 pt-2">
          <Input
            label="Commission Percentage"
            type="number"
            min={0}
            max={100}
            step={0.5}
            placeholder="e.g. 15"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => { setCommissionModal({ isOpen: false, profileId: null }); setCommission(''); }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateCommission}
              disabled={!commission || actionLoading !== null}
            >
              Update Commission
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
