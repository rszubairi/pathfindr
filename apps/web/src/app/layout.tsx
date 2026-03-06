import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pathfindr - Student Opportunity Platform',
  description:
    'Connect with global scholarships, university programmes, internships, and job opportunities',
  keywords: [
    'scholarships',
    'university',
    'internships',
    'jobs',
    'students',
    'education',
    'Southeast Asia',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
