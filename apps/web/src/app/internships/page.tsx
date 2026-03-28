'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import Image from 'next/image';
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
      {/* Hero Banner */}
      <div className="relative bg-blue-600 py-10 sm:py-14 text-white overflow-hidden">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Find Corporate Internships</h1>
              <p className="text-blue-100 text-base sm:text-lg max-w-2xl">
                Launch your career with internships from top global companies.
              </p>
            </div>
            <div className="hidden md:block relative">
              <div className="relative h-[240px] w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/20">
                <Image
                  src="/images/internships-hero.jpg"
                  alt="Student preparing for corporate internship"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-l from-blue-600/30 to-transparent" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8 sm:py-12">
        {/* Filters */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Filter by type</h3>
          <div className="flex flex-wrap gap-2">
            {['Full-time', 'Part-time', 'Remote'].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Internship Listings */}
        <div className="space-y-4">
          {!internships ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 h-40 animate-pulse bg-gray-50">
                  <div className="h-full bg-gray-100/50 rounded-lg" />
                </Card>
              ))}
            </div>
          ) : internships.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No active internships found.</p>
            </div>
          ) : (
            internships.map((internship) => (
              <Card key={internship._id} className="p-5 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {internship.companyName === 'Private Company' ? (
                        <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full text-xs font-medium">
                          <Lock className="w-3 h-3 shrink-0" />
                          Premium subscribers only
                        </div>
                      ) : (
                        <span className="text-blue-600 font-semibold truncate">{internship.companyName}</span>
                      )}
                      <Badge variant="outline" className="capitalize shrink-0">{internship.type}</Badge>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{internship.title}</h2>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{internship.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 shrink-0" />
                        Deadline: {new Date(internship.deadline).toLocaleDateString()}
                      </div>
                      {internship.salaryRange && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4 shrink-0" />
                          {internship.salaryRange}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/internships/${internship._id}`}>
                        <Button variant="secondary" size="sm">View Details</Button>
                      </Link>
                      <Link href={`/internships/${internship._id}`}>
                        <Button size="sm">Apply Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
