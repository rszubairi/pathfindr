import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ms', 'zh', 'es', 'pt', 'de', 'ja', 'ko', 'vi', 'id', 'hi'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  // 1. Check if we have a preference cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].split('-')[0])
      .find(lang => locales.includes(lang));
    
    if (preferredLocale) return preferredLocale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Exclude static files and robots/sitemap
  const isPublicFile = pathname.match(/\.(.*)$/) || 
                       pathname.startsWith('/api/') ||
                       pathname === '/robots.txt' ||
                       pathname === '/sitemap.xml';

  if (isPublicFile) return;

  // Redirect to the detected locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/` and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
