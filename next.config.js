/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Set build phase for better detection
    NEXT_PHASE: process.env.NEXT_PHASE || 'phase-production-build'
  },
  
  experimental: {
    // Disable build-time database connections
    serverComponentsExternalPackages: ['prisma', '@prisma/client'],
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Prevent nodemailer and other server-only packages during build
    if (!isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(nodemailer|@prisma\/client)$/,
        })
      )
    }

    // Skip email and database operations during build
    if (process.env.NODE_ENV === 'production' && !dev) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.SKIP_BUILD_STATIC_GENERATION': JSON.stringify('true'),
          'process.env.NEXT_PHASE': JSON.stringify('phase-production-build')
        })
      )
    }

    return config
  },

  // Optimize build performance
  swcMinify: true,
  
  // Prevent static optimization issues
  output: 'standalone',
  
}

module.exports = nextConfig