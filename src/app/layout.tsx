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
        {/* Critical font preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <OrganizationSchema />
        <WebsiteSchema />
        <WebVitals />
        <ABTestProvider>
          <Header />
          <main className="min-h-screen">
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