import Link from 'next/link';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const platformLinks = [
  { name: 'Scholarships', href: '/scholarships' },
  { name: 'Universities', href: '/universities' },
  { name: 'Internships', href: '/internships' },
  { name: 'Jobs', href: '/jobs' },
];

const resourceLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Features', href: '/features' },
  { name: 'Help Center', href: '/help' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
];

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              Your path to global educational opportunities. Connect with scholarships, universities,
              internships, and jobs across Southeast Asia and beyond.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
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
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
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
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>

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
              &copy; {currentYear} Pathfindr. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Made with <span className="text-red-500">❤️</span> in Southeast Asia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
