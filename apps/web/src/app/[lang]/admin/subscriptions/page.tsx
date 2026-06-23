'use client';

import { CreditCard, Download, Search, TrendingUp, DollarSign, Users, Calendar, Receipt } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useState } from 'react';

interface Subscription {
  _id: string;
  _creationTime: number;
  userName: string;
  userEmail: string;
  tier: 'pro' | 'expert';
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  stripeSubscriptionId: string;
}

interface Invoice {
  _id: string;
  _creationTime: number;
  invoiceNumber: string;
  userName: string;
  userEmail: string;
  tier: 'pro' | 'expert';
  amount: number;
  currency: string;
  status: 'generated' | 'sent' | 'failed';
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

interface Stats {
  totalActive: number;
  totalRevenue: number;
  avgCheckout: number;
  totalTransactions: number;
}

type Tab = 'subscriptions' | 'transactions';

export default function AdminSubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('subscriptions');

  const subscriptions = useQuery(api.adminSubscriptions.listSubscriptions, {
    status: 'active'
  }) as Subscription[] | undefined;

  const stats = useQuery(api.adminSubscriptions.getSubscriptionStats) as Stats | undefined;
  const invoices = useQuery(api.adminSubscriptions.listAllInvoices) as Invoice[] | undefined;

  const filteredSubscriptions = subscriptions?.filter((sub: Subscription) =>
    sub.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices?.filter((inv: Invoice) =>
    inv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: currency || 'MYR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalRevenueFormatted = stats
    ? new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 2 }).format(stats.totalRevenue)
    : '...';

  const avgCheckoutFormatted = stats
    ? new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 2 }).format(stats.avgCheckout)
    : '...';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Ledger
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{totalRevenueFormatted}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Checkout</p>
              <p className="text-2xl font-bold text-gray-900">{avgCheckoutFormatted}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalActive.toLocaleString() : '...'}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalTransactions.toLocaleString() : '...'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 border-gray-100 shadow-sm">
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'subscriptions'
                ? 'text-primary-600 border-b-2 border-primary-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'transactions'
                ? 'text-primary-600 border-b-2 border-primary-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Invoice Transactions
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'subscriptions' ? 'Search by name or email...' : 'Search by name, email or invoice no...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'subscriptions' ? (
            !subscriptions ? (
              <div className="py-20 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading subscriptions...</p>
              </div>
            ) : (
              <Table>
                <TableHead>
                  <tr>
                    <TableHeaderCell>Customer</TableHeaderCell>
                    <TableHeaderCell>Tier</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Subscription Date</TableHeaderCell>
                    <TableHeaderCell>Expiry Date</TableHeaderCell>
                  </tr>
                </TableHead>
                <TableBody>
                  {filteredSubscriptions?.map((sub) => (
                    <TableRow key={sub._id}>
                      <TableCell>
                        <div>
                          <p className="font-bold text-gray-900">{sub.userName}</p>
                          <p className="text-xs text-gray-500">{sub.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{sub.tier}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">{sub.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(sub.currentPeriodStart)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(sub.currentPeriodEnd)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSubscriptions?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-500 italic">
                        No active subscriptions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )
          ) : (
            !invoices ? (
              <div className="py-20 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading transactions...</p>
              </div>
            ) : (
              <Table>
                <TableHead>
                  <tr>
                    <TableHeaderCell>Invoice No.</TableHeaderCell>
                    <TableHeaderCell>Customer</TableHeaderCell>
                    <TableHeaderCell>Tier</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                  </tr>
                </TableHead>
                <TableBody>
                  {filteredInvoices?.map((inv) => (
                    <TableRow key={inv._id}>
                      <TableCell className="text-sm font-mono text-gray-700">{inv.invoiceNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-gray-900">{inv.userName}</p>
                          <p className="text-xs text-gray-500">{inv.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{inv.tier}</Badge>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-gray-900">
                        {formatCurrency(inv.amount, inv.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={inv.status === 'failed' ? 'danger' : 'success'} className="capitalize">
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(inv.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredInvoices?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500 italic">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )
          )}
        </div>
      </Card>
    </div>
  );
}
