'use client';

import { Users, Search, Filter, MoreVertical, Mail, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';

export default function AdminUsersPage() {
  // Mock data for display
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student', status: 'verified', joined: '2024-03-01' },
    { id: '2', name: 'Jane Smith', email: 'jane@parent.com', role: 'parent', status: 'pending', joined: '2024-03-10' },
    { id: '3', name: 'Michael Chen', email: 'm.chen@example.com', role: 'student', status: 'verified', joined: '2024-02-15' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah.w@example.com', role: 'student', status: 'verified', joined: '2024-03-05' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Bulk Email
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Permissions
          </Button>
        </div>
      </div>

      <Card className="p-4 border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Joined</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'verified' ? 'success' : 'warning'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(user.joined).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-primary-900">User Growth Insight</h4>
          <p className="text-sm text-primary-700 mt-1">Registration volume has increased by 15% this week.</p>
        </div>
        <Button variant="primary" className="bg-primary-600 hover:bg-primary-700">View Report</Button>
      </div>
    </div>
  );
}
