'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CreditCard, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Id } from '@convex/_generated/dataModel';

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth();
  
  const payments = useQuery(
    api.scholarshipFeaturePayments.getCorporatePayments,
    user?._id ? { corporateUserId: user._id as Id<'users'> } : 'skip'
  );

  if (authLoading || (user && payments === undefined)) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">View your payment history for featured scholarships and other services</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Transaction History</h3>
            <p className="text-xs text-gray-500">All your payments processed through Pathfindr</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm">
                <th className="px-4 py-3 font-medium text-gray-500">Service</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments?.map((payment: any) => (
                <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">Scholarship Feature Upgrade</div>
                    <div className="text-xs text-gray-400">Monthly Pin (30 Days)</div>
                  </td>
                  <td className="px-4 py-4">
                    {payment.status === 'completed' ? (
                      <Badge variant="success" className="gap-1 px-2">
                        <CheckCircle2 size={12} />
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1 px-2">
                        <AlertCircle size={12} />
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-gray-900">
                    {payment.currency} {payment.amount.toFixed(2)}
                  </td>
                </tr>
              ))}

              {(!payments || payments.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <CreditCard className="w-12 h-12 text-gray-200" />
                      <p>No transaction history found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Need help with billing?</h4>
            <p className="text-sm text-gray-500">Contact our support team for any billing-related inquiries.</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
          Support Center
        </button>
      </div>
    </div>
  );
}
