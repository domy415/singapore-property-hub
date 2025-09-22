/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PHASE: process.env.NEXT_PHASE || 'phase-production-server',
  },
  images: {
    // Use external image service that always works
    domains: ['placehold.co'],
    // Don't try to optimize external images
    unoptimized: true,
  },
  experimental: {
    optimizeCss: false, // Disable CSS optimization to fix broken styles
    serverComponentsExternalPackages: ['prisma', '@prisma/client'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  output: 'standalone',
  swcMinify: true,
  
  webpack: (config, { dev, isServer, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PHASE': JSON.stringify(
          dev ? 'phase-development-server' : 'phase-production-build'
        ),
      })
    );
    
    if (!dev && isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^nodemailer$/,
        })
      );
    }
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;