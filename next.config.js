/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PHASE: process.env.NEXT_PHASE,
  },
  experimental: {
    optimizeCss: true,
    serverComponentsExternalPackages: ['prisma', '@prisma/client'],
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