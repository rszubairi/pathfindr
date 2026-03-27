'use client';

import { useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@convex/_generated/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { MainLayout } from '@/components/layout/MainLayout';
import { Mail, Phone, ChevronLeft, User, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Id } from '@convex/_generated/dataModel';

export default function InternshipResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const internshipId = params.id as string;
  
  const internship = useQuery(api.internships.getById, { 
    id: internshipId as Id<'internships'> 
  });

  const applications = useQuery(api.internshipApplications.getByInternship, { 
    internshipId: internshipId as Id<'internships'> 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg shrink-0">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {internship?.title ? `Applicants: ${internship.title}` : 'Loading...'}
          </h1>
          <p className="text-gray-500 text-sm">Review student applications for this position.</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Student Info</TableHeaderCell>
              <TableHeaderCell>Date Applied</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!applications ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12">
                   <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                  No applications received yet.
                </TableCell>
              </TableRow>
            ) : (
              (applications as any[]).map((app: any) => (
                <TableRow key={app._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-4 py-2">
                       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                         {app.studentName.charAt(0)}
                       </div>
                       <div>
                         <div className="font-bold text-gray-900">{app.studentName}</div>
                         <div className="text-xs text-gray-500 flex items-center gap-1">
                           <Mail className="w-3 h-3" />
                           {app.studentEmail}
                         </div>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                     <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(app._creationTime).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => window.location.href = `mailto:${app.studentEmail}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Link href={`/dashboard/users/${app.studentId}`}>
                         <Button variant="ghost" size="sm">
                            <User className="w-4 h-4 mr-2" />
                            Profile
                         </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
