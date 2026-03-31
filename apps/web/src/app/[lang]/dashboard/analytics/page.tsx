'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { Eye, Users, MousePointerClick, TrendingUp } from 'lucide-react';
import type { Id } from '@convex/_generated/dataModel';

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();

  const analytics = useQuery(
    api.institutionScholarships.getScholarshipAnalytics,
    user?._id ? { userId: user._id as Id<'users'> } : 'skip'
  );

  if (authLoading || analytics === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const overallConversion = analytics.totalViews > 0 
    ? ((analytics.totalApplications / analytics.totalViews) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Track the performance of your scholarships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Views"
          value={analytics.totalViews}
          icon={Eye}
        />
        <StatsCard
          label="Total Applications"
          value={analytics.totalApplications}
          icon={Users}
          className="lg:delay-100"
        />
        <StatsCard
          label="Conversion Match"
          value={`${overallConversion}%`}
          icon={MousePointerClick}
          className="lg:delay-200"
        />
        <StatsCard
          label="Active Listings"
          value={analytics.activeScholarships}
          icon={TrendingUp}
          className="lg:delay-300"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Performance by Scholarship</h3>
        </div>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Scholarship Name</TableHeaderCell>
              <TableHeaderCell className="text-right">Views</TableHeaderCell>
              <TableHeaderCell className="text-right">Applications</TableHeaderCell>
              <TableHeaderCell className="text-right">Conversion Match</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics.perScholarship.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                  No data available yet.
                </TableCell>
              </TableRow>
            ) : (
              analytics.perScholarship.map((scholarship: any) => (
                <TableRow key={scholarship._id}>
                  <TableCell className="font-medium text-gray-900 hover:text-primary-600 transition-colors">
                    {scholarship.name}
                  </TableCell>
                  <TableCell className="text-right text-gray-600">
                    {scholarship.views.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-gray-600">
                    {scholarship.applications.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      parseFloat(scholarship.conversionRate) >= 10 ? 'bg-green-100 text-green-800' :
                      parseFloat(scholarship.conversionRate) > 0 ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {scholarship.conversionRate}%
                    </span>
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
