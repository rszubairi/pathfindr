'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@convex/_generated/api';
import { ResumeContent } from '@/components/profile/ResumeOptimizer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Printer, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { Id } from '@convex/_generated/dataModel';

export default function PublicResumePage() {
  const params = useParams();
  const userId = params.userId as string;

  const data = useQuery(api.profiles.getPublicResume, { userId: userId as Id<'users'> });

  if (data === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Not Found</h1>
        <p className="text-gray-600 mb-6">This resume link might be invalid or the profile has been set to private.</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto mb-6 no-print flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to PathFindr
          </Link>
        </Button>
        <Button variant="primary" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <ResumeContent 
            profile={data.profile} 
            user={data.user} 
            showProgress={false} 
        />
      </div>

      <div className="max-w-4xl mx-auto mt-8 no-print text-center">
        <p className="text-sm text-gray-500">
          Powered by <span className="font-bold text-primary-600">ThePathFindr</span> — 
          Connecting students with global opportunities.
        </p>
      </div>
    </div>
  );
}
