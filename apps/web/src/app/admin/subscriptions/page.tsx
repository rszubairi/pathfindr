'use client';

import { CreditCard, Download, Search, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';

export default function AdminSubscriptionsPage() {
  const transactions = [
    { id: 'TXN-101', user: 'University of Malaya', tier: 'expert', amount: '$499', status: 'succeeded', date: '2024-03-10' },
    { id: 'TXN-102', user: 'Monash University', tier: 'pro', amount: '$199', status: 'succeeded', date: '2024-03-09' },
    { id: 'TXN-103', user: 'Peter Pan', tier: 'pro', amount: '$29', status: 'pending', date: '2024-03-08' },
    { id: 'TXN-104', user: 'Khalid Masood', tier: 'expert', amount: '$199', status: 'failed', date: '2024-03-07' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions & Billing</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Ledger
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$12,450</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Checkout</p>
              <p className="text-2xl font-bold text-gray-900">$142</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Subs</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="p-4 border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by transaction ID or user..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Tier</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                  <TableCell className="font-bold text-gray-800">{txn.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{txn.tier}</Badge>
                  </TableCell>
                  <TableCell className="font-bold">{txn.amount}</TableCell>
                  <TableCell>
                    <Badge variant={
                      txn.status === 'succeeded' ? 'success' : 
                      txn.status === 'failed' ? 'danger' : 'warning'
                    }>
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{txn.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
