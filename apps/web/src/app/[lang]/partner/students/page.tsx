'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Users, Search } from 'lucide-react';
import type { Id } from '@convex/_generated/dataModel';

export default function PartnerStudentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const profile = useQuery(
    api.partners.getPartnerProfileByUserId,
    user ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const students = useQuery(
    api.partners.getPartnerStudents,
    profile ? { partnerProfileId: profile._id } : 'skip'
  );

  const filtered = students?.filter((s) => {
    if (!s) return false;
    const q = search.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-7 h-7 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
      </div>

      {/* Summary */}
      {students && (
        <div className="flex items-center gap-6 text-sm">
          <span className="text-gray-600">
            <span className="font-bold text-gray-900 text-lg">{students.length}</span> total referred
          </span>
          <span className="text-gray-600">
            <span className="font-bold text-green-700 text-lg">
              {students.filter((s) => s?.hasActiveSubscription).length}
            </span>{' '}
            with active subscription
          </span>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {!students ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            {students.length === 0
              ? 'No students have registered with your partner code yet.'
              : 'No students match your search.'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-4">Student</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-3">Registered</div>
              <div className="col-span-2 text-right">Subscription</div>
            </div>
            {filtered.map((student) => (
              <div key={student?.userId} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-gray-900">{student?.fullName}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-600">{student?.email}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-500">
                    {student?.joinedAt ? new Date(student.joinedAt).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className="col-span-2 flex justify-end">
                  {student?.hasActiveSubscription ? (
                    <Badge variant="success" className="capitalize">
                      {student.subscriptionTier}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Free</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
