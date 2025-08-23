'use client'

import React, { Suspense, lazy } from 'react'
import { HeroImage, GalleryImage } from '@/components/ui/OptimizedImage'
import { usePerformanceOptimization } from './PerformanceOptimizer'

// Lazy load non-critical components
const LatestArticles = lazy(() => import('@/components/home/LatestArticles'))
const NewsletterSignup = lazy(() => import('@/components/home/NewsletterSignup'))

interface OptimizedHomepageProps {
  heroData: {
    title: string
    subtitle: string
    backgroundImage: string
    ctaText: string
    ctaLink: string
  }
  featuredArticles?: Array<{
    id: string
    title: string
    slug: string
    description: string
    image?: string
    publishedAt: string
  }>
}

export default function OptimizedHomepage({ 
  heroData, 
  featuredArticles = [] 
}: OptimizedHomepageProps) {
  const { preloadImage, markInteractive } = usePerformanceOptimization()

  // Preload critical images on component mount
  React.useEffect(() => {
    preloadImage(heroData.backgroundImage)
    markInteractive()
  }, [heroData.backgroundImage, preloadImage, markInteractive])

  return (
    <>
      {/* Hero Section - Critical Above-the-fold Content */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image - Priority Loading */}
        <div className="absolute inset-0 z-0">
          <HeroImage
            src={heroData.backgroundImage}
            alt="Singapore Property Hub Hero"
            width={1920}
            height={1080}
            className="object-cover w-full h-full"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {heroData.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            {heroData.subtitle}
          </p>
          
          {/* CTA Buttons - Above the fold */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={heroData.ctaLink}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {heroData.ctaText}
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              Get Expert Advice
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Trust Indicators - Second Priority */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">76+</div>
              <div className="text-gray-600">Active Leads</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">28</div>
              <div className="text-gray-600">Districts Covered</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">150+</div>
              <div className="text-gray-600">Properties Analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content - Lazy Loaded */}
      <Suspense fallback={<ContentSkeleton />}>
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Latest Property Insights
              </h2>
              <p className="text-xl text-gray-600">
                Expert analysis and market updates to guide your investment decisions
              </p>
            </div>

            {/* Article Grid with Lazy Loading */}
            <div className="grid md:grid-cols-3 gap-8">
              {featuredArticles.slice(0, 6).map((article, index) => (
                <article 
                  key={article.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {article.image && (
                    <div className="aspect-video overflow-hidden">
                      <GalleryImage
                        src={article.image}
                        alt={article.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={75}
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      <a 
                        href={`/articles/${article.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString('en-SG')}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Suspense>

      {/* Lead Capture - Lazy Loaded */}
      <Suspense fallback={<FormSkeleton />}>
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Personalized Property Recommendations
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Tell us your preferences and we'll match you with the perfect properties
            </p>
            
            <div className="max-w-md mx-auto">
              {/* Lead capture form would go here */}
              <div className="bg-white text-gray-900 shadow-xl p-6 rounded-lg">
                <p className="text-center text-gray-600">Lead capture form placeholder</p>
              </div>
            </div>
          </div>
        </section>
      </Suspense>
    </>
  )
}

// Loading skeleton components
function ContentSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 skeleton" />
          <div className="h-6 bg-gray-300 rounded w-96 mx-auto skeleton" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-300 skeleton" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-300 rounded skeleton" />
                <div className="h-4 bg-gray-300 rounded skeleton" />
                <div className="h-4 bg-gray-300 rounded w-3/4 skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FormSkeleton() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 text-center">
        <div className="h-8 bg-blue-500 rounded w-96 mx-auto mb-6 skeleton" />
        <div className="h-6 bg-blue-500 rounded w-80 mx-auto mb-8 skeleton" />
        <div className="max-w-md mx-auto bg-white rounded-lg p-6 space-y-4">
          <div className="h-12 bg-gray-300 rounded skeleton" />
          <div className="h-12 bg-gray-300 rounded skeleton" />
          <div className="h-12 bg-blue-600 rounded skeleton" />
        </div>
      </div>
    </section>
  )
}