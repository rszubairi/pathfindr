import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pathfindr.com.my';

  // Core public pages
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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
