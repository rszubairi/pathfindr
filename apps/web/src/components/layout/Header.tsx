'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Scholarships', href: '/scholarships' },
  { name: 'Boarding Schools', href: '/boarding-schools' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Features', href: '/features' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-100 text-primary-700 uppercase tracking-wider">
              Beta
            </span>
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
                  {mounted ? t(`nav.${item.name.toLowerCase().replace(' ', '')}`) : item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 mr-2 border-r pr-4 border-gray-200">
              <Globe className="w-4 h-4 text-gray-400" />
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
                className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer text-gray-700 hover:text-primary-600 transition-colors"
              >
                <option value="en">EN</option>
                <option value="ms">BM</option>
                <option value="zh">ZH</option>
              </select>
            </div>

            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 text-gray-600 transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href={
                        user.role === 'admin'
                          ? '/admin'
                          : user.role === 'institution'
                            ? '/dashboard/profile'
                            : '/profile/view'
                      }
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      {mounted ? t('nav.myProfile', { defaultValue: 'My Profile' }) : 'My Profile'}
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      {mounted ? t('nav.signOut', { defaultValue: 'Sign Out' }) : 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">{mounted ? t('nav.signIn') : 'Sign In'}</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/register">{mounted ? t('nav.getStarted') : 'Get Started'}</Link>
                </Button>
              </>
            )}
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
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-100 text-primary-700 uppercase tracking-wider">
                    Beta
                  </span>
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
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {mounted ? t(`nav.${item.name.toLowerCase().replace(' ', '')}`) : item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Language Switcher */}
                <div className="mt-8 px-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Select Language
                  </p>
                  <div className="flex gap-2">
                    {['en', 'ms', 'zh'].map((lng) => (
                      <button
                        key={lng}
                        onClick={() => changeLanguage(lng)}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
                          i18n.language === lng
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-primary-600'
                        )}
                      >
                        {lng === 'en' ? 'English' : lng === 'ms' ? 'Bahasa' : '中文'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auth Buttons - Mobile */}
              <div className="p-4 border-t space-y-3">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full"
                      asChild
                    >
                      <Link
                        href={
                          user.role === 'admin'
                            ? '/admin'
                            : user.role === 'institution'
                              ? '/dashboard/profile'
                              : '/profile/view'
                        }
                      >
                        {mounted ? t('nav.myProfile', { defaultValue: 'My Profile' }) : 'My Profile'}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      className="w-full text-red-600"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                    >
                      {mounted ? t('nav.signOut', { defaultValue: 'Sign Out' }) : 'Sign Out'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full"
                      asChild
                    >
                      <Link href="/login">{mounted ? t('nav.signIn') : 'Sign In'}</Link>
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      asChild
                    >
                      <Link href="/register">{mounted ? t('nav.getStarted') : 'Get Started'}</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
