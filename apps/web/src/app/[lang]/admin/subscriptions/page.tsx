'use client';

import { CreditCard, Download, Search, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
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

interface Stats {
  totalActive: number;
  totalRevenue: number;
  avgCheckout: number;
}

export default function AdminSubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const subscriptions = useQuery(api.adminSubscriptions.listSubscriptions, {
    status: 'active'
  }) as Subscription[] | undefined;
  
  const stats = useQuery(api.adminSubscriptions.getSubscriptionStats) as Stats | undefined;

  const filteredSubscriptions = subscriptions?.filter((sub: Subscription) => 
    sub.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.stripeSubscriptionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Active Subscriptions</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Ledger
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estimated Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats ? `$${stats.totalRevenue.toLocaleString()}` : '...'}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {stats ? `$${Math.round(stats.avgCheckout).toLocaleString()}` : '...'}
              </p>
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
      </div>

      <Card className="p-4 border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by student name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {!subscriptions ? (
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
                      <Badge variant="success">
                        {sub.status}
                      </Badge>
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
          )}
        </div>
      </Card>
    </div>
  );
}

