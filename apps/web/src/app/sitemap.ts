import { MetadataRoute } from 'next';

const locales = ['en', 'ms', 'zh', 'es', 'pt', 'de', 'ja', 'ko', 'vi', 'id'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.thepathfindr.com';

  // Core public routes
  const routes = [
    '',
    '/about',
    '/pricing',
    '/scholarships',
    '/boarding-schools',
    '/international-schools',
    '/internships',
    '/knowledge-base',
    '/login',
    '/register',
  ];

  // Generate localized versions of all core routes
  const sitemapEntries = locales.flatMap((locale) => 
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  return sitemapEntries;
}
