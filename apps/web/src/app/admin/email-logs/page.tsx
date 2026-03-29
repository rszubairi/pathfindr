'use client';

import { Mail, Search, RefreshCcw, Eye, ShieldAlert, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { useState } from 'react';

interface EmailLog {
  _id: string;
  recipientEmail: string;
  subject: string;
  body: string;
  sentAt: string;
  type: string;
  status: 'sent' | 'failed';
  error?: string;
}

export default function AdminEmailLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  
  const logs = useQuery(api.emailLogs.listLogs, { limit: 100 }) as EmailLog[] | undefined;

  const filteredLogs = logs?.filter((log) => 
    log.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-MY', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <p className="text-sm text-blue-700 mt-1">
            Showing last {logs?.length || 0} emails sent from the system.
          </p>
        </div>
      </div>

      <Card className="p-4 border-gray-100 shadow-sm">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search email recipient or subject..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>

        <div className="overflow-x-auto">
          {!logs ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading email logs...</p>
            </div>
          ) : (
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
                {filteredLogs?.map((log) => (
                  <TableRow key={log._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-800">{log.recipientEmail}</TableCell>
                    <TableCell className="text-sm text-gray-600 leading-tight max-w-xs truncate">{log.subject}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{log.type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'sent' ? 'success' : 'danger'}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 whitespace-nowrap">{formatDate(log.sentAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500 italic">
                      No matching email logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {/* Email Preview Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-1">{selectedLog.subject}</h3>
                <p className="text-xs text-gray-500 mt-0.5">To: {selectedLog.recipientEmail} • {formatDate(selectedLog.sentAt)}</p>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {selectedLog.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                  <p className="font-bold mb-1 underline">Error Details:</p>
                  <p className="font-mono text-xs">{selectedLog.error}</p>
                </div>
              )}
              <div 
                className="prose prose-sm max-w-none border p-4 rounded-lg bg-gray-50/30"
                dangerouslySetInnerHTML={{ __html: selectedLog.body }}
              />
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onClick={() => setSelectedLog(null)}>Close Preview</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

