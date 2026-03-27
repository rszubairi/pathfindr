'use client';

import { useQuery, useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@convex/_generated/api';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building2, 
  Lock, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { Id } from '@convex/_generated/dataModel';

import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionModal } from '@/components/subscription/SubscriptionModal';

export default function InternshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { isSubscribed, isLoading: subLoading } = useSubscription();

  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  const internshipId = params.id as string;
  const internship = useQuery(api.internships.getById, { 
    id: internshipId as Id<'internships'> 
  });

  const applyMutation = useMutation(api.internshipApplications.apply);

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/internships/${internshipId}`);
      return;
    }

    if (!isSubscribed) {
      setIsSubModalOpen(true);
      return;
    }

    setIsApplying(true);
    setApplyError(null);
    try {
      if (!user?._id) throw new Error('You must be logged in to apply');
      
      await applyMutation({ 
        internshipId: internshipId as Id<'internships'>,
        userId: user._id as Id<'users'>,
      });
      setApplySuccess(true);
    } catch (err: any) {
      setApplyError(err.message || 'Failed to apply.');
    } finally {
      setIsApplying(false);
    }
  };

  if (!internship) {
    return (
      <MainLayout>
        <Container className="py-20 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading internship details...</p>
        </Container>
      </MainLayout>
    );
  }

  const isAnonymized = internship.companyName === 'Private Company';

  return (
    <MainLayout>
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <Container>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to listings
          </button>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="capitalize">{internship.type}</Badge>
                    {isAnonymized && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Private Listing
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
                  <div className="flex items-center gap-2 text-lg text-gray-600">
                    <Building2 className="w-5 h-5" />
                    <span className={isAnonymized ? 'italic text-gray-400' : 'font-medium'}>
                      {internship.companyName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-gray-100 mb-8">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</div>
                  <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    {internship.location}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</div>
                  <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                    <Briefcase className="w-4 h-4 text-primary-500" />
                    {internship.salaryRange || 'Not disclosed'}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</div>
                  <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    {new Date(internship.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About the Role</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {internship.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {internship.responsibilities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {internship.requirements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </Card>
          </div>

          {/* Sidebar Action */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-6 border-t-4 border-primary-600">
              {applySuccess ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Application Sent!</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Your application for <strong>{internship.title}</strong> has been submitted. The company will be notified.
                  </p>
                  <Button variant="secondary" className="w-full" onClick={() => router.push('/internships')}>
                    Browse more
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Interested in this role?</h3>
                  
                  {applyError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex gap-2 text-sm text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      {applyError}
                    </div>
                  )}

                  <div className="space-y-4">
                    {!isAuthenticated ? (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-4">
                          Sign in to see the company name and apply for this internship.
                        </p>
                        <Link href={`/login?redirect=/internships/${internshipId}`}>
                          <Button className="w-full">Sign In to Apply</Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <Button 
                          className="w-full" 
                          size="lg" 
                          onClick={handleApply}
                          isLoading={isApplying || subLoading}
                          disabled={isApplying || subLoading}
                        >
                          Send Application
                        </Button>
                        {!isSubscribed && !subLoading && (
                          <p className="text-xs text-center text-amber-600 font-medium">
                            Premium subscription required to apply
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {isAnonymized && isAuthenticated && (
                     <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 leading-relaxed font-medium">
                          Note: Companies choose to hide their name to avoid direct solicitation. Once you apply, the employer will receive your application details.
                        </p>
                     </div>
                  )}
                </>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3 text-sm">
                <Link href="/faq" className="block text-gray-600 hover:text-primary-600 transition">How applications work</Link>
                <Link href="/terms" className="block text-gray-600 hover:text-primary-600 transition">Privacy Policy</Link>
                <Link href="/contact" className="block text-gray-600 hover:text-primary-600 transition">Report this listing</Link>
              </div>
            </Card>
          </div>
        </div>
      </Container>

      <SubscriptionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
        description="Internship applications require an active Pro or Expert subscription. Choose a plan below to continue."
      />
    </MainLayout>
  );
}

