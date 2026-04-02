import { MetadataRoute } from 'next';

const locales = ['en', 'ms', 'zh', 'es', 'pt', 'de', 'ja', 'ko', 'vi', 'id', 'hi'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.thepathfindr.com';

  // Country slugs for university rankings
  const rankingCountries = [
    'united-states',
    'united-kingdom',
    'germany',
    'france',
    'spain',
    'italy',
    'netherlands',
    'finland',
    'sweden',
    'croatia',
    'malaysia',
    'indonesia',
    'pakistan',
  ];

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
    '/university-rankings',
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

  // Generate localized versions of country ranking pages
  const rankingEntries = locales.flatMap((locale) =>
    rankingCountries.map((country) => ({
      url: `${baseUrl}/${locale}/university-rankings/${country}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  return [...sitemapEntries, ...rankingEntries];
}
