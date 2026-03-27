'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/components/layout/MainLayout';
import { MapPin, Calendar, Briefcase, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import type { Id } from '@convex/_generated/dataModel';

export default function InternshipsPage() {
  const { user } = useAuth();
  const internships = useQuery(api.internships.listActive, {
    userId: user?._id as Id<'users'> | undefined,
  });

  return (
    <MainLayout>
      <div className="bg-blue-600 py-12 text-white">
        <Container>
          <h1 className="text-4xl font-bold mb-4">Find Corporate Internships</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Launch your career with internships from top global companies.
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar (Simplified) */}
          <div className="w-full lg:w-64 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Type</h3>
              <div className="space-y-2">
                {['Full-time', 'Part-time', 'Remote'].map((type) => (
                  <label key={type} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Internship Listings */}
          <div className="flex-1 space-y-6">
            {!internships ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 h-48 animate-pulse bg-gray-50">
                    <div className="h-full bg-gray-100/50 rounded-lg" />
                  </Card>
                ))}
              </div>
            ) : internships.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No active internships found.</p>
              </div>
            ) : (
              internships.map((internship) => (
                <Card key={internship._id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {internship.companyName === 'Private Company' ? (
                          <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            <Lock className="w-3 h-3" />
                            Premium subscribers only
                          </div>
                        ) : (
                          <span className="text-blue-600 font-semibold">{internship.companyName}</span>
                        )}
                        <Badge variant="outline">{internship.type}</Badge>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{internship.title}</h2>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {internship.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Deadline: {new Date(internship.deadline).toLocaleDateString()}
                        </div>
                        {internship.salaryRange && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {internship.salaryRange}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/internships/${internship._id}`}>
                          <Button variant="secondary" size="sm">View Details</Button>
                        </Link>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
