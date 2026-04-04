'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, DollarSign, Copy, CheckCheck, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import type { Id } from '@convex/_generated/dataModel';

export default function PartnerDashboardPage() {
  const { user } = useAuth();
  const [codeCopied, setCodeCopied] = useState(false);

  const profile = useQuery(
    api.partners.getPartnerProfileByUserId,
    user ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const students = useQuery(
    api.partners.getPartnerStudents,
    profile ? { partnerProfileId: profile._id } : 'skip'
  );

  const earnings = useQuery(
    api.partners.getPartnerEarnings,
    profile ? { partnerProfileId: profile._id } : 'skip'
  );

  const copyCode = () => {
    if (!profile?.partnerCode) return;
    navigator.clipboard.writeText(profile.partnerCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalStudents = students?.length ?? 0;
  const studentsWithSubs = students?.filter((s) => s?.hasActiveSubscription).length ?? 0;
  const studentsWithPaidSubs = earnings?.studentsWithPaidSubs ?? 0;
  const commissionPct = profile.commissionPercentage ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile.companyName || profile.personInChargeName}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's a summary of your partner activity.</p>
      </div>

      {/* Partner Code */}
      <Card className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <p className="text-primary-100 text-sm font-medium mb-2">Your Partner Code</p>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-mono font-bold tracking-widest">{profile.partnerCode}</span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            {codeCopied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {codeCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-primary-100 text-xs mt-3">
          Share this code with students. They enter it during registration to be linked to your account.
        </p>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total Students Referred</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Students Subscribed</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{studentsWithSubs}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Commission Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{commissionPct}%</p>
        </Card>
      </div>

      {/* Eligible Earings Summary */}
      {studentsWithPaidSubs > 0 && (
        <Card className="p-5 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-900">
                {studentsWithPaidSubs} student{studentsWithPaidSubs !== 1 ? 's' : ''} with paid subscriptions this period
              </p>
              <p className="text-sm text-green-700 mt-0.5">
                You are eligible to submit an earnings claim for this month.
              </p>
            </div>
            <Link
              href="/partner/earnings"
              className="text-sm font-medium text-green-700 hover:text-green-800 underline"
            >
              View Earnings
            </Link>
          </div>
        </Card>
      )}

      {/* Recent students */}
      {students && students.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Students</h2>
            <Link href="/partner/students" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          <Card className="divide-y divide-gray-100">
            {students.slice(0, 5).map((student) => (
              <div key={student?.userId} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{student?.fullName}</p>
                  <p className="text-xs text-gray-500">{student?.email}</p>
                </div>
                <Badge variant={student?.hasActiveSubscription ? 'success' : 'secondary'}>
                  {student?.hasActiveSubscription ? `${student.subscriptionTier} plan` : 'Free'}
                </Badge>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
