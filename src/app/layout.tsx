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
})

export const metadata: Metadata = {
  metadataBase: new URL('https://singaporepropertyhub.sg'),
  title: {
    default: 'Singapore Property Hub - Premier Real Estate Portal for Condos, Landed & Commercial Properties',
    template: '%s | Singapore Property Hub'
  },
  description: 'Find your dream property in Singapore. Expert insights on condominiums, landed properties, and commercial shophouses. Get the best deals with Singapore\'s top property portal.',
  keywords: ['singapore property', 'singapore real estate', 'singapore condos', 'singapore landed property', 'singapore commercial property', 'property for sale singapore', 'property agent singapore'],
  authors: [{ name: 'Singapore Property Hub' }],
  creator: 'Singapore Property Hub',
  publisher: 'Singapore Property Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Singapore Property Hub - Premier Real Estate Portal',
    description: 'Find your dream property in Singapore with expert insights and exclusive listings.',
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
    description: 'Premier Real Estate Portal for Singapore Properties',
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