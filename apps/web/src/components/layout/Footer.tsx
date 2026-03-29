'use client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const platformLinks = [
    { name: mounted ? t('nav.scholarships') : 'Scholarships', href: '/scholarships' },
    { name: mounted ? t('nav.boardingschools') : 'Boarding Schools', href: '/boarding-schools' },
    { name: mounted ? t('footer.links.internships') : 'Internships', href: '/internships' },
    { name: mounted ? t('nav.internationalschools') : 'International Schools', href: '/international-schools' },
  ];

  const resourceLinks = [
    { name: mounted ? t('nav.features') : 'Features', href: '/#features' },
    { name: mounted ? t('nav.pricing') : 'Pricing', href: '/#pricing' },
    { name: mounted ? t('footer.links.knowledgeBase') : 'Knowledge Base', href: '/knowledge-base' },
    { name: mounted ? t('footer.links.privacyPolicy') : 'Privacy Policy', href: '/privacy' },
    { name: mounted ? t('footer.links.termsOfService') : 'Terms of Service', href: '/terms' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Branding */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <GraduationCap className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition" />
              <span className="text-xl font-bold text-gray-900">Pathfindr</span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              {mounted ? t('footer.description') : 'Your path to global educational opportunities. Connect with scholarships, boarding schools, international schools, and internships across Southeast Asia and beyond.'}
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{mounted ? t('footer.platform') : 'Platform'}</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary-600 transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{mounted ? t('footer.resources') : 'Resources'}</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary-600 transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{mounted ? t('footer.connect') : 'Connect'}</h3>

            {/* Social Media */}
            <div className="flex gap-3 mb-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <a
                href="mailto:hello@pathfindr.com"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition"
              >
                <Mail className="h-4 w-4" />
                hello@pathfindr.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Pathfindr. {mounted ? t('footer.allRightsReserved') : 'All rights reserved.'}
            </p>
            <p className="text-sm text-gray-500">
              {mounted ? t('footer.madeWith') : 'Made with'} <span className="text-red-500">❤️</span> {mounted ? t('footer.inSEA') : 'in Southeast Asia'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

