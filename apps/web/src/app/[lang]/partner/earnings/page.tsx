'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DollarSign, Info } from 'lucide-react';
import type { Id } from '@convex/_generated/dataModel';

export default function PartnerEarningsPage() {
  const { user } = useAuth();

  const profile = useQuery(
    api.partners.getPartnerProfileByUserId,
    user ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const earnings = useQuery(
    api.partners.getPartnerEarnings,
    profile ? { partnerProfileId: profile._id } : 'skip'
  );

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  if (!earnings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const eligibleStudents = earnings.students.filter((s) => s.hasPaidSubscription);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <DollarSign className="w-7 h-7 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">Total Students Referred</p>
          <p className="text-3xl font-bold text-gray-900">{earnings.totalReferred}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">Students with Paid Subscriptions</p>
          <p className="text-3xl font-bold text-green-700">{earnings.studentsWithPaidSubs}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">Your Commission Rate</p>
          <p className="text-3xl font-bold text-primary-700">{earnings.commissionPercentage}%</p>
        </Card>
      </div>

      {/* How it works */}
      <Card className="p-5 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 space-y-1">
            <p className="font-semibold">How Earnings Work</p>
            <p>
              At the end of each month, you can submit a claim for students you referred who have paid subscriptions.
              Our team will review and process your claim. Your commission is <strong>{earnings.commissionPercentage}%</strong> of
              the subscription revenue for each eligible student.
            </p>
            <p>
              To submit a claim, contact <a href="mailto:partners@thepathfindr.com" className="underline font-medium">partners@thepathfindr.com</a> with
              your partner code and the current month's reference.
            </p>
          </div>
        </div>
      </Card>

      {/* Eligible students this period */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{currentMonth} — Eligible Students</h2>
        <p className="text-sm text-gray-500 mb-4">
          Students you referred who currently have an active paid subscription.
        </p>

        <Card className="overflow-hidden">
          {eligibleStudents.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No students with paid subscriptions this period.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <div className="col-span-4">Student</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Referred On</div>
                <div className="col-span-3 text-right">Subscriptions</div>
              </div>
              {eligibleStudents.map((student) => (
                <div key={student.studentUserId} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50">
                  <div className="col-span-4">
                    <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600">{student.studentEmail}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">{new Date(student.joinedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-3 flex flex-wrap justify-end gap-1">
                    {student.paidSubscriptions.map((sub, i) => (
                      <Badge key={i} variant="success" className="capitalize">
                        {sub.tier}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* All referred students */}
      {earnings.students.filter((s) => !s.hasPaidSubscription).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Free-tier Students</h2>
          <p className="text-sm text-gray-500 mb-4">
            Referred students who haven't subscribed yet — not eligible for claims.
          </p>
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {earnings.students
                .filter((s) => !s.hasPaidSubscription)
                .map((student) => (
                  <div key={student.studentUserId} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                      <p className="text-xs text-gray-500">{student.studentEmail}</p>
                    </div>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
