'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  UserPlus,
  Heart
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';

export default function AdminDashboardPage() {
  const institutions = useQuery(api.adminInstitutions.listInstitutions, {});
  const dashboardStats = useQuery(api.adminDashboard.getDashboardStats);
  
  if (!dashboardStats) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Loading system overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
        <p className="mt-2 text-gray-600">Global status and real-time activity metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Registrations"
          value={dashboardStats.totalRegistrations.toLocaleString()}
          icon={Users}
        />
        <StatsCard
          label="Active Subscriptions"
          value={dashboardStats.activeSubscriptions.toLocaleString()}
          icon={CreditCard}
        />
        <StatsCard
          label="Total Referrals"
          value={dashboardStats.totalReferrals.toLocaleString()}
          icon={UserPlus}
        />
        <StatsCard
          label="Corporates"
          value={dashboardStats.totalCorporates.toLocaleString()}
          icon={Building2}
        />
        <StatsCard
          label="Corporate Donations"
          value={dashboardStats.totalDonations.toLocaleString()}
          icon={Heart}
        />
        <StatsCard
          label="Total Institutions"
          value={dashboardStats.totalInstitutions.toLocaleString()}
          icon={Building2}
        />
        <StatsCard
          label="Pending Approvals"
          value={dashboardStats.pendingInstitutions.toLocaleString()}
          icon={Clock}
          className={dashboardStats.pendingInstitutions > 0 ? "border-amber-200 bg-amber-50/30" : ""}
        />
        <StatsCard
          label="Estimated Revenue (Annual)"
          value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 shadow-md border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Recent Provider Approvals
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
            {institutions?.filter((i: any) => i.approvalStatus === 'approved').length === 0 && (
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
                <p className="text-sm font-bold text-amber-900">{dashboardStats.pendingInstitutions} Institution Requests</p>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">Verification required for new providers to list scholarships and internships.</p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-4 border border-blue-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">System Activity</p>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">Email verification queue is active. Normal volume observed.</p>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl flex items-start gap-4 border border-purple-200">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-purple-900">Subscription Activity</p>
                <p className="text-xs text-purple-800 mt-1 leading-relaxed">System is currently managing {dashboardStats.activeSubscriptions} active premium students.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

