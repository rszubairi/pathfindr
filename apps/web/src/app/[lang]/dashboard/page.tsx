'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { GraduationCap, FileText, Eye, Users, FilePlus } from 'lucide-react';
import Link from 'next/link';
import type { Id } from '@convex/_generated/dataModel';

import { CorporateOverview } from '@/components/dashboard/CorporateOverview';

export default function DashboardOverviewPage() {
  const { user, loading: authLoading } = useAuth();

  const analytics = useQuery(
    api.institutionScholarships.getScholarshipAnalytics,
    user?._id && user.role === 'institution' ? { userId: user._id as Id<'users'> } : 'skip'
  );

  if (authLoading || (user?.role === 'institution' && analytics === undefined)) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user?.role === 'corporate') {
    return <CorporateOverview />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.fullName || 'Institution User'}</p>
        </div>
        <Link
          href="/dashboard/scholarships/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <FilePlus className="w-5 h-5" />
          Create Scholarship
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Scholarships"
          value={analytics?.totalScholarships || 0}
          icon={GraduationCap}
        />
        <StatsCard
          label="Active Scholarships"
          value={analytics?.activeScholarships || 0}
          icon={FileText}
          className="lg:delay-100"
        />
        <StatsCard
          label="Total Views"
          value={analytics?.totalViews || 0}
          icon={Eye}
          className="lg:delay-200"
        />
        <StatsCard
          label="Total Applications"
          value={analytics?.totalApplications || 0}
          icon={Users}
          className="lg:delay-300"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Recent Scholarships</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm">
                <th className="px-6 py-4 font-medium text-gray-500">Name</th>
                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 font-medium text-gray-500">Applications</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Conversion Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics?.perScholarship.slice(0, 5).map((scholarship: any) => (
                <tr key={scholarship._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{scholarship.name}</div>
                    <div className="text-sm text-gray-500">{scholarship.currency} {scholarship.value}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      scholarship.status === 'active' ? 'bg-green-100 text-green-800' :
                      scholarship.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{scholarship.applications}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{scholarship.conversionRate}%</td>
                </tr>
              ))}
              {(!analytics?.perScholarship || analytics.perScholarship.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No scholarships created yet. Start by creating a new scholarship.
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
