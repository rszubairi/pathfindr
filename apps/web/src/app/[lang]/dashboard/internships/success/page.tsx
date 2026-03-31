'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function InternshipPaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  return (
    <Container className="py-20 max-w-2xl mx-auto">
      <Card className="p-12 text-center shadow-lg border-2 border-green-50">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Thank you for choosing Pathfindr. Your internship listing(s) are now live and visible to students.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard/internships">
            <Button size="lg" className="w-full sm:w-auto">
              Go to Dashboard <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/internships">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <Briefcase className="mr-2 w-4 h-4" />
              View on Public List
            </Button>
          </Link>
        </div>

        {sessionId && (
           <p className="mt-8 text-xs text-gray-400 font-mono">
             Reference: {sessionId.substring(0, 20)}...
           </p>
        )}
      </Card>
    </Container>
  );
}
