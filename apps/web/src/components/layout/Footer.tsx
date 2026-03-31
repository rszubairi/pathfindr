'use client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  // Helper to get localized href
  const getLocalizedHref = (href: string) => {
    // Only localize internal absolute paths, not hashes or external URLs
    if (href.startsWith('http') || href.startsWith('#')) return href;
    const currentLang = i18n.language || 'en';
    const cleanHref = href === '/' ? '' : href;
    return `/${currentLang}${cleanHref}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const platformLinks = [
    { name: t('nav.scholarships', { defaultValue: 'Scholarships' }), href: '/scholarships' },
    { name: t('nav.boardingschools', { defaultValue: 'Boarding Schools' }), href: '/boarding-schools' },
    { name: t('footer.links.internships', { defaultValue: 'Internships' }), href: '/internships' },
    { name: t('nav.internationalschools', { defaultValue: 'International Schools' }), href: '/international-schools' },
  ];

  const resourceLinks = [
    { name: t('nav.features', { defaultValue: 'Features' }), href: '/#features' },
    { name: t('nav.pricing', { defaultValue: 'Pricing' }), href: '/#pricing' },
    { name: t('footer.links.knowledgeBase', { defaultValue: 'Knowledge Base' }), href: '/knowledge-base' },
    { name: t('footer.links.privacyPolicy', { defaultValue: 'Privacy Policy' }), href: '/privacy' },
    { name: t('footer.links.termsOfService', { defaultValue: 'Terms of Service' }), href: '/terms' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/thepathfindr-com/', icon: Linkedin },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Branding */}
          <div className="space-y-4">
            <Link href={getLocalizedHref('/')} className="flex items-center gap-2 group">
              <GraduationCap className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition" />
              <span className="text-xl font-bold text-gray-900">Pathfindr</span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('footer.description', { defaultValue: 'Your path to global educational opportunities. Connect with scholarships, boarding schools, international schools, and internships across Southeast Asia and beyond.' })}
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('footer.platform', { defaultValue: 'Platform' })}</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={getLocalizedHref(link.href)}
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
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('footer.resources', { defaultValue: 'Resources' })}</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={getLocalizedHref(link.href)}
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
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('footer.connect', { defaultValue: 'Connect' })}</h3>

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
              &copy; {currentYear} Pathfindr. {t('footer.allRightsReserved', { defaultValue: 'All rights reserved.' })}
            </p>
            <p className="text-sm text-gray-500">
              {t('footer.madeWith', { defaultValue: 'Made with' })} <span className="text-red-500">❤️</span> {t('footer.inSEA', { defaultValue: 'in Southeast Asia' })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
