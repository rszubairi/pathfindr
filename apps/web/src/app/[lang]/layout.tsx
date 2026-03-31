import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '../../styles/globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

const locales = ['en', 'ms', 'zh', 'es', 'pt', 'de', 'ja', 'ko', 'vi', 'id', 'hi'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pathfindr.com.my';
  
  // Generating alternate languages for SEO (hreflang)
  const alternates: Record<string, string> = {};
  locales.forEach((locale) => {
    alternates[locale] = `${baseUrl}/${locale}`;
  });
  // Add x-default
  alternates['x-default'] = `${baseUrl}/en`;

  return {
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
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: alternates,
    },
  };
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  return (
    <html lang={lang}>
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
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
