'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Scholarships', href: '/scholarships' },
  { name: 'Features', href: '/features' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <GraduationCap className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition" />
            <span className="text-xl font-bold text-gray-900">Pathfindr</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-2',
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 md:hidden shadow-xl">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary-600" />
                  <span className="text-lg font-bold text-gray-900">Pathfindr</span>
                </div>
                <button
                  type="button"
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Auth Buttons - Mobile */}
              <div className="p-4 border-t space-y-3">
                <Button variant="secondary" size="md" className="w-full" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button variant="primary" size="md" className="w-full" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
