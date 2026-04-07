export function getAppUrl() {
  const url = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    // If we're running in a Convex action, we might want to know if it's a production deployment
    // but for now, we'll just default to localhost for dev and warn if it's missing.
    return 'http://www.thepathfindr.com';
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
}
