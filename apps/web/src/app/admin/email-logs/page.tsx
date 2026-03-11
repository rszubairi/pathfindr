'use client';

import { Mail, Search, RefreshCcw, Eye, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';

export default function AdminEmailLogsPage() {
  const logs = [
    { id: '1', recipient: 'john@example.com', subject: 'Verify your Pathfindr account', type: 'verification', status: 'delivered', sent: '10 mins ago' },
    { id: '2', recipient: 'admin@university.edu', subject: 'Institution Request Approved', type: 'system', status: 'delivered', sent: '1 hour ago' },
    { id: '3', recipient: 'error@fail.com', subject: 'Password Reset', type: 'auth', status: 'failed', sent: '2 hours ago' },
    { id: '4', recipient: 'jane@parent.com', subject: 'New Scholarship Match!', type: 'match', status: 'delivered', sent: '3 hours ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Mail className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">System Email Logs</h1>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" />
          Purge Old Logs
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-6">
        <div className="p-4 bg-blue-50 rounded-2xl">
          <ShieldAlert className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-900">Delivery Status Monitoring</h3>
          <p className="text-sm text-blue-700 mt-1">Current delivery rate is 98.4%. No major outages detected in Resend service.</p>
        </div>
      </div>

      <Card className="p-4 border-gray-100 shadow-sm">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search email recipient..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Recipient</TableHeaderCell>
                <TableHeaderCell>Subject</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Sent</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-800">{log.recipient}</TableCell>
                  <TableCell className="text-sm text-gray-600">{log.subject}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">{log.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'delivered' ? 'success' : 'danger'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{log.sent}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
