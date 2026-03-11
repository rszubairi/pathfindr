'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Mail, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Institutions', href: '/admin/institutions', icon: Building2 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'Email Logs', href: '/admin/email-logs', icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button - moved down to avoid overlap with global header */}
      <div className="lg:hidden fixed top-20 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white rounded-md shadow-md text-gray-600 hover:text-gray-900 border border-gray-200"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar background overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={twMerge(
        clsx(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )
      )}>
        <div className="h-full flex flex-col">
          {/* Admin Header */}
          <div className="px-6 py-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Admin Panel</h2>
                <p className="text-xs text-slate-400">System Control</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={twMerge(
                    clsx(
                      "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )
                  )}
                >
                  <item.icon
                    className={clsx(
                      "flex-shrink-0 w-5 h-5",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Bottom section */}
          <div className="p-4 border-t border-slate-800">
            <div className="p-4 rounded-lg bg-slate-800/50">
              <p className="text-xs text-slate-400 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-200">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
