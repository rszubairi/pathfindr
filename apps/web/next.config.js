/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'Pathfindr',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  turbopack: {
    root: require('path').resolve(__dirname, '../../'),
  },
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
