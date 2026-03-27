'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { StatsCard } from './StatsCard';
import { Briefcase, Users, FilePlus, Building2, Globe, Mail, Phone, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Id } from '@convex/_generated/dataModel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function CorporateOverview() {
  const { user } = useAuth();

  const profile = useQuery(
    api.institutionAuth.getInstitutionProfile,
    user?._id ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const internships = useQuery(
    api.internships.getByCompany,
    profile?._id ? { companyId: profile._id as Id<'institutionProfiles'> } : 'skip'
  );

  const activeCount = internships?.filter(i => i.status === 'active').length || 0;
  const draftCount = internships?.filter(i => i.status === 'draft' || i.status === 'pending_payment').length || 0;

  if (!profile || internships === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corporate Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your company profile and internship listings</p>
        </div>
        <Link
          href="/dashboard/internships/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium"
        >
          <FilePlus className="w-5 h-5" />
          Post New Internship
        </Link>
      </div>

      {/* Profile Summary Card */}
      <Card className="p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Building2 size={120} />
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 flex-shrink-0">
            {profile.logoUrl ? (
                <img src={profile.logoUrl} alt={profile.institutionName} className="w-full h-full object-contain rounded-2xl" />
            ) : (
                <Building2 size={40} />
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{profile.institutionName}</h2>
                <Badge variant={profile.approvalStatus === 'approved' ? 'success' : 'warning'}>
                  {profile.approvalStatus.charAt(0).toUpperCase() + profile.approvalStatus.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-500 text-sm mt-1">Corporate ID: {profile.corporateIdentityNumber}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-primary-500" />
                {profile.picEmail}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-primary-500" />
                {profile.picPhone}
              </div>
               {profile.website && (
                 <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline">
                   <Globe className="w-4 h-4" />
                   {new URL(profile.website).hostname}
                 </a>
               )}
            </div>
          </div>
          <Link href="/dashboard/profile">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Edit Profile
            </button>
          </Link>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Active Internships"
          value={activeCount}
          icon={Briefcase}
        />
        <StatsCard
          label="Draft/Pending"
          value={draftCount}
          icon={Users}
          className="lg:delay-100"
        />
        <StatsCard
          label="Total Responses"
          value="0"
          icon={Users}
          className="lg:delay-200"
        />
      </div>

      {/* Recent Internships Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Recent Internship Listings</h3>
          <Link href="/dashboard/internships" className="text-sm text-primary-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm">
                <th className="px-6 py-4 font-medium text-gray-500">Position</th>
                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 font-medium text-gray-500">Deadline</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {internships.slice(0, 5).map((internship) => (
                <tr key={internship._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{internship.title}</div>
                    <div className="text-xs text-gray-500">{internship.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      internship.status === 'active' ? 'success' : 
                      internship.status === 'draft' ? 'warning' : 'outline'
                    }>
                      {internship.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(internship.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/internships/${internship._id}/responses`} className="text-primary-600 hover:text-primary-700 transition-colors">
                      <Users className="w-5 h-5 inline" />
                    </Link>
                    <Link href={`/dashboard/internships/${internship._id}`} className="ml-4 text-gray-600 hover:text-gray-900 transition-colors">
                      <ExternalLink className="w-5 h-5 inline" />
                    </Link>
                  </td>
                </tr>
              ))}
              {internships.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Briefcase className="w-12 h-12 text-gray-300" />
                      <p>No internships posted yet.</p>
                      <Link href="/dashboard/internships/create">
                        <button className="text-primary-600 font-medium hover:underline">Post your first internship</button>
                      </Link>
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
