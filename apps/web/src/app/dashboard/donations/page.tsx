'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Heart, Users, Wallet, DollarSign, Copy, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Id } from '../../../../../../convex/_generated/dataModel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function DonationsDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const profile = useQuery(
    api.institutionAuth.getInstitutionProfile,
    user?._id ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const stats = useQuery(
    api.corporateDonations.getDonationStats,
    user?._id ? { corporateUserId: user._id as Id<'users'> } : 'skip'
  );

  const donations = useQuery(
    api.corporateDonations.getDonationsByCompany,
    profile?._id ? { companyId: profile._id as Id<'institutionProfiles'> } : 'skip'
  );

  const beneficiaries = useQuery(
    api.corporateDonations.getAllBeneficiaries,
    user?._id ? { corporateUserId: user._id as Id<'users'> } : 'skip'
  );

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(`${appUrl}/claim/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (authLoading || stats === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donation Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your student subscription donations and their impact
          </p>
        </div>
        <Link href="/dashboard/donations/purchase">
          <Button size="lg" className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Make a Donation
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Donated"
          value={stats?.totalDonated ?? 0}
          icon={Heart}
        />
        <StatsCard
          label="Students Supported"
          value={stats?.totalAssigned ?? 0}
          icon={Users}
          className="lg:delay-100"
        />
        <StatsCard
          label="Remaining Balance"
          value={stats?.totalRemaining ?? 0}
          icon={Wallet}
          className="lg:delay-200"
        />
        <StatsCard
          label="Total Invested"
          value={`$${(stats?.totalAmountSpent ?? 0).toFixed(2)}`}
          icon={DollarSign}
          className="lg:delay-300"
        />
      </div>

      {/* Donation History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Donation History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm">
                <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                <th className="px-6 py-4 font-medium text-gray-500">Tier</th>
                <th className="px-6 py-4 font-medium text-gray-500">Quantity</th>
                <th className="px-6 py-4 font-medium text-gray-500">Assigned</th>
                <th className="px-6 py-4 font-medium text-gray-500">Remaining</th>
                <th className="px-6 py-4 font-medium text-gray-500">Coupon Code</th>
                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donations && donations.length > 0 ? (
                donations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">
                        {donation.tier.charAt(0).toUpperCase() + donation.tier.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {donation.quantityPurchased}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{donation.quantityAssigned}</td>
                    <td className="px-6 py-4 text-gray-600">{donation.quantityRemaining}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                          {donation.couponCode}
                        </code>
                        <button
                          onClick={() => handleCopyCode(donation.couponCode)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy shareable link"
                        >
                          {copiedCode === donation.couponCode ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          donation.status === 'completed'
                            ? 'success'
                            : donation.status === 'exhausted'
                              ? 'outline'
                              : 'warning'
                        }
                      >
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Heart className="w-12 h-12 text-gray-300" />
                      <p>No donations yet.</p>
                      <Link href="/dashboard/donations/purchase">
                        <button className="text-primary-600 font-medium hover:underline">
                          Make your first donation
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Students Supported</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm">
                <th className="px-6 py-4 font-medium text-gray-500">Student Name</th>
                <th className="px-6 py-4 font-medium text-gray-500">Email</th>
                <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                <th className="px-6 py-4 font-medium text-gray-500">Claim Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {beneficiaries && beneficiaries.length > 0 ? (
                beneficiaries.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{b.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.studentEmail}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={b.claimMethod === 'auto_assigned' ? 'outline' : 'success'}>
                        {b.claimMethod === 'auto_assigned' ? 'Auto-Assigned' : 'Coupon Claimed'}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-12 h-12 text-gray-300" />
                      <p>No students have been supported yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
