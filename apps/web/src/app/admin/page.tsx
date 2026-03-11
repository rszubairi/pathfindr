'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';

export default function AdminDashboardPage() {
  const institutions = useQuery(api.adminInstitutions.listInstitutions, {});
  
  // Basic stats from whatever data is available
  const stats = {
    totalInstitutions: institutions?.length || 0,
    pendingApprovals: institutions?.filter((i: any) => i.approvalStatus === 'pending').length || 0,
    approvedInstitutions: institutions?.filter((i: any) => i.approvalStatus === 'approved').length || 0,
    totalStudents: 0, // Placeholder
    activeSubscriptions: 0, // Placeholder
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
        <p className="mt-2 text-gray-600">Global status and quick actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Institutions"
          value={stats.totalInstitutions.toString()}
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          label="Pending Approvals"
          value={stats.pendingApprovals.toString()}
          icon={Clock}
        />
        <StatsCard
          label="Total Users"
          value="1,280" // Placeholder
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          label="Revenue"
          value="$12,450" // Placeholder
          icon={TrendingUp}
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 shadow-md border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Recent Approvals
          </h3>
          <div className="space-y-4">
            {institutions?.filter((i: any) => i.approvalStatus === 'approved').slice(0, 5).map((inst: any) => (
              <div key={inst._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                    {inst.institutionName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{inst.institutionName}</p>
                    <p className="text-xs text-gray-500">{inst.approvedAt ? new Date(inst.approvedAt).toLocaleDateString() : 'Just now'}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">Approved</span>
              </div>
            ))}
            {stats.approvedInstitutions === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 italic">No recent approvals</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-md border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Urgent Tasks
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-xl flex items-start gap-4 border border-amber-200">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">{stats.pendingApprovals} Institution Requests</p>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">Verification required for new providers to list scholarships.</p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-4 border border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">System Activity</p>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">Resend verification queue is active. Normal volume observed.</p>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl flex items-start gap-4 border border-purple-200">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-900">Subscription Renewals</p>
                <p className="text-xs text-purple-800 mt-1 leading-relaxed">12 subscriptions are scheduled for renewal in the next 48 hours.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
