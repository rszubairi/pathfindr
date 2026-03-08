/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
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
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
