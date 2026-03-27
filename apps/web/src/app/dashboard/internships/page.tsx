'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { Plus, Users, CreditCard, ChevronRight, Briefcase, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export default function CorporateInternshipsPage() {
  const { user } = useAuth();
  
  const profile = useQuery(
    api.institutionAuth.getInstitutionProfile,
    user?._id ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const internships = useQuery(
    api.internships.getByCompany,
    profile?._id ? { companyId: profile._id as Id<'institutionProfiles'> } : 'skip'
  );

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'draft': return <Badge variant="warning">Draft</Badge>;
      case 'pending_payment': return <Badge variant="warning">Pending Payment</Badge>;
      case 'closed': return <Badge variant="outline">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Internship Listings</h1>
          <p className="mt-1 text-sm text-gray-500">Post and manage your corporate internships</p>
        </div>
        <Link href="/dashboard/internships/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Post New (RM15)
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-l-4 border-primary-600">
           <div className="flex items-center gap-4">
            <div className="bg-primary-50 p-2.5 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase">Active Listings</div>
              <div className="text-2xl font-bold">{internships?.filter(i => i.status === 'active').length || 0}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-green-600">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-2.5 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase">Total Responses</div>
              <div className="text-2xl font-bold">0</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-orange-600">
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 p-2.5 rounded-lg">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase">Drafts</div>
              <div className="text-2xl font-bold">{internships?.filter(i => i.status === 'draft').length || 0}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Position</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Payment</TableHeaderCell>
              <TableHeaderCell>Deadline</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!internships ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                   <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ) : internships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  No internships found. Start by posting a new one!
                </TableCell>
              </TableRow>
            ) : (
              internships.map((internship) => (
                <TableRow key={internship._id}>
                  <TableCell className="font-medium text-gray-900">
                    <div>{internship.title}</div>
                    <div className="text-xs text-gray-500 font-normal">{internship.location}</div>
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(internship.status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={internship.paymentStatus === 'paid' ? 'success' : 'warning'}>
                      {internship.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(internship.deadline).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3 items-center">
                      <Link href={`/dashboard/internships/${internship._id}/responses`} className="text-gray-400 hover:text-primary-600" title="View Responses">
                        <Users className="w-4 h-4" />
                      </Link>
                      <Link href={`/dashboard/internships/${internship._id}`} className="text-gray-400 hover:text-blue-600" title="Edit">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Payment Call to Action */}
      {internships?.some(i => i.status === 'draft') && (
        <div className="bg-primary-600 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-primary-200">
          <div>
            <h3 className="text-xl font-bold">Unpaid Listings Found</h3>
            <p className="opacity-90">Pay for your draft internships to make them go live for students.</p>
          </div>
          <Link href="/dashboard/internships/billing">
            <Button variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100 border-none">
              Complete Payment <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
