import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import StructuredData from '@/components/seo/StructuredData'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://singaporepropertyhub.sg'),
  title: {
    default: 'Singapore Property Hub - Expert Property Guides & Market Insights',
    template: '%s | Singapore Property Hub'
  },
  description: 'Your trusted source for Singapore property market insights, buying guides, investment tips, and expert real estate advice. Get the latest property trends and analysis.',
  keywords: ['singapore property market', 'singapore property guide', 'singapore property investment', 'singapore property trends', 'singapore property analysis', 'singapore property expert', 'singapore real estate insights'],
  authors: [{ name: 'Singapore Property Hub' }],
  creator: 'Singapore Property Hub',
  publisher: 'Singapore Property Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Singapore Property Hub - Expert Property Guides & Market Insights',
    description: 'Your trusted source for Singapore property market insights, buying guides, and investment strategies.',
    url: 'https://singaporepropertyhub.sg',
    siteName: 'Singapore Property Hub',
    images: [
      {
        url: 'https://singaporepropertyhub.sg/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Singapore Property Hub',
      }
    ],
    locale: 'en_SG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Singapore Property Hub',
    description: 'Expert Property Guides & Market Insights for Singapore',
    images: ['https://singaporepropertyhub.sg/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <link rel="canonical" href="https://singaporepropertyhub.sg" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <StructuredData type="website" />
        <StructuredData type="organization" />
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