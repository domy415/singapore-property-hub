// Deployment: Image fixes update - 2025-08-29 15:15 SGT
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { OrganizationSchema, WebsiteSchema } from '@/components/seo/SchemaMarkup'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import WebVitals from '@/components/performance/WebVitals'
import { defaultMetadata } from '@/lib/metadata'
import { ABTestProvider } from '@/context/ABTestContext'
import ImagePreloader from '@/components/ui/ImagePreloader'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL('https://singapore-property-hub.vercel.app'),
  title: {
    default: 'Singapore Property Hub - Your Trusted Property Investment Guide',
    template: '%s | Singapore Property Hub'
  },
  alternates: {
    canonical: 'https://singapore-property-hub.vercel.app',
  },
  openGraph: {
    ...defaultMetadata.openGraph,
    url: 'https://singapore-property-hub.vercel.app',
    images: [
      {
        url: 'https://singapore-property-hub.vercel.app/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Singapore Property Hub - Your Trusted Property Investment Guide',
      }
    ],
  },
  twitter: {
    ...defaultMetadata.twitter,
    images: ['https://singapore-property-hub.vercel.app/images/og-default.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-SG">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Critical resource preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <OrganizationSchema />
        <WebsiteSchema />
        <WebVitals />
        <ImagePreloader
          images={[
            {
              src: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1920&h=1080&fit=crop&q=90&fm=webp',
              priority: true,
              format: 'webp'
            },
            {
              src: 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?w=1920&h=1080&fit=crop&q=90&fm=webp',
              priority: true,
              format: 'webp'
            }
          ]}
          preloadAll={false}
        />
        <ABTestProvider>
          <Header />
          <main className="min-h-screen pt-[70px]">
            {children}
          </main>
          <Footer />
        </ABTestProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}