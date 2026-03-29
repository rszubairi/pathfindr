import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
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
      <head>
        {/* Google Analytics Tag */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DHXDWNDQHB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DHXDWNDQHB');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
