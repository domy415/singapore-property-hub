// Deployment: Image fixes update - 2025-08-29 15:15 SGT
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
  metadataBase: new URL('https://singapore-property-hub.vercel.app'),
  title: {
    default: 'Singapore Property Hub - Your Trusted Property Investment Guide',
    template: '%s | Singapore Property Hub'
  },
  description: 'Expert insights and unbiased reviews for serious property buyers. Comprehensive analysis of Singapore\'s real estate market with professional property intelligence.',
  alternates: {
    canonical: 'https://singapore-property-hub.vercel.app',
  },
  openGraph: {
    title: 'Singapore Property Hub - Your Trusted Property Investment Guide',
    description: 'Expert insights and unbiased reviews for serious property buyers',
    url: 'https://singapore-property-hub.vercel.app',
    siteName: 'Singapore Property Hub',
    locale: 'en_SG',
    type: 'website',
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
    card: 'summary_large_image',
    title: 'Singapore Property Hub - Your Trusted Property Investment Guide',
    description: 'Expert insights and unbiased reviews for serious property buyers',
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
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}