/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.propertyguru.com.sg', 'images.99.co', 'singaporepropertyhub.sg'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/property',
        destination: '/properties',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig