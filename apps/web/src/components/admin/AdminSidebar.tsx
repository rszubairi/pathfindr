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
  ShieldCheck,
  Handshake,
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Institutions', href: '/admin/institutions', icon: Building2 },
  { name: 'Partners', href: '/admin/partners', icon: Handshake },
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
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )
      )}>
        <div className="h-full flex flex-col pt-16 lg:pt-0">
          {/* Admin Label */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-bold text-gray-900 tracking-wide uppercase">Admin Portal</span>
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
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )
                  )}
                >
                  <item.icon
                    className={clsx(
                      "flex-shrink-0 w-5 h-5",
                      isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* System Status info - subtle white version */}
          <div className="p-4 border-t border-gray-100">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-gray-600">System Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
