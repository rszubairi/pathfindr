'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { CreditCard, ShieldCheck, ChevronRight, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export default function InternshipBillingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const profile = useQuery(
    api.institutionAuth.getInstitutionProfile,
    user?._id ? { userId: user._id as Id<'users'> } : 'skip'
  );

  const internships = useQuery(
    api.internships.getByCompany,
    profile?._id ? { companyId: profile._id as Id<'institutionProfiles'> } : 'skip'
  );

  const pendingInternships = (internships?.filter((i: any) => i.status === 'draft' || i.status === 'pending_payment') || []) as any[];
  const totalPrice = pendingInternships.length * 15;

  const createCheckout = useAction(api.stripeActions.createInternshipCheckoutSession);

  const handlePayment = async () => {
    if (!user?._id || !profile?._id || pendingInternships.length === 0) return;
    
    setIsProcessing(true);
    try {
      const { sessionUrl } = await createCheckout({
        userId: user._id as Id<'users'>,
        companyId: profile._id as Id<'institutionProfiles'>,
        internshipIds: pendingInternships.map((i: any) => i._id),
      });
      window.location.href = sessionUrl;
    } catch (err) {
      console.error(err);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & List Payment</h1>
          <p className="text-gray-500">Review and pay for your internship listings.</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()}>Back to Dashboard</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Pending Listings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Internship Position</TableHeaderCell>
                  <TableHeaderCell>Fee</TableHeaderCell>
                  <TableHeaderCell className="text-right">Action</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingInternships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                      No internships pending payment.
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingInternships.map((internship: any) => (
                    <TableRow key={internship._id}>
                      <TableCell className="font-medium text-gray-900">
                        {internship.title}
                        <div className="text-xs text-gray-500 font-normal">{internship.location}</div>
                      </TableCell>
                      <TableCell>RM 15.00</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/internships/${internship._id}`} className="text-sm text-primary-600 hover:underline">
                          Edit
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Secure Payment Note */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 italic text-sm text-gray-600">
            <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
            <p>Payments are securely processed via Stripe. Your internships will go live immediately after successful payment.</p>
          </div>
        </div>

        {/* Right: Checkout Summary */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Listings count</span>
                <span>{pendingInternships.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Fee per listing</span>
                <span>RM 15.00</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total Amount</span>
                <span>RM {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full mt-8" 
              size="lg" 
              onClick={handlePayment} 
              disabled={pendingInternships.length === 0 || isProcessing}
              isLoading={isProcessing}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Checkout Now
            </Button>

            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 grayscale opacity-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Secure payment via <span className="text-gray-900 font-black">STRIPE</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
