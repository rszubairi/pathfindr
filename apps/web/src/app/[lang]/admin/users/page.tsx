'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Users, Search, MoreVertical, Mail, Shield, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '@/components/ui/Table';

interface Subscription {
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  tier: 'pro' | 'expert';
  currentPeriodEnd: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'student' | 'institution' | 'philanthropist' | 'admin' | 'corporate';
  emailVerified: boolean;
  createdAt: string;
  subscription: Subscription | null;
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'student' | 'institution' | 'philanthropist' | 'admin' | 'corporate' | ''>('student');
  
  const users = useQuery(api.adminUsers.listUsers, { 
    role: roleFilter === '' ? undefined : roleFilter 
  }) as User[] | undefined;

  const filteredUsers = users?.filter((user: User) => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubscriptionBadge = (subscription: Subscription | null) => {
    if (!subscription) return <Badge variant="outline">Free</Badge>;
    
    switch (subscription.status) {
      case 'active':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {subscription.tier.toUpperCase()}
          </Badge>
        );
      case 'canceled':
        return <Badge variant="warning">Canceled</Badge>;
      case 'past_due':
        return <Badge variant="danger">Past Due</Badge>;
      default:
        return <Badge variant="secondary">{subscription.status}</Badge>;
    }
  };

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition bg-white text-sm font-medium"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="institution">Institutions</option>
              <option value="corporate">Corporate</option>
              <option value="philanthropist">Philanthropists</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {!users ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : (
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>User</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                  <TableHeaderCell>Subscription</TableHeaderCell>
                  <TableHeaderCell>Verification</TableHeaderCell>
                  <TableHeaderCell>Joined</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {filteredUsers?.map((user: User) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <p className="font-bold text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {getSubscriptionBadge(user.subscription)}
                    </TableCell>
                    <TableCell>
                      {user.emailVerified ? (
                        <Badge variant="success" size="sm">Verified</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500 italic">
                      No users found matching your criteria
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
