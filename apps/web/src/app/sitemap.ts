import { MetadataRoute } from 'next';

const locales = ['en', 'ms', 'zh', 'es', 'pt', 'de', 'ja', 'ko', 'vi', 'id', 'hi'];

const RANKINGS_YEARS = [2025];

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

  const coreEntries = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  // Global rankings index per year: /en/university-rankings/2025
  const globalRankingEntries = locales.flatMap((locale) =>
    RANKINGS_YEARS.map((year) => ({
      url: `${baseUrl}/${locale}/university-rankings/${year}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  );

  // Country ranking pages per year: /en/university-rankings/2025/malaysia
  const countryRankingEntries = locales.flatMap((locale) =>
    RANKINGS_YEARS.flatMap((year) =>
      rankingCountries.map((country) => ({
        url: `${baseUrl}/${locale}/university-rankings/${year}/${country}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    )
  );

  return [...coreEntries, ...globalRankingEntries, ...countryRankingEntries];
}
