'use client'

import { useABVariant, useABTestContext } from '@/context/ABTestContext'
import { ABTestCTAButton } from '@/components/ui/ABTestButton'
import { useEffect } from 'react'

interface HeroArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage: string
  category: string
  publishedAt: Date
  readTime: string
}

interface ABTestHeroProps {
  featuredArticle: HeroArticle
}

export default function ABTestHero({ featuredArticle }: ABTestHeroProps) {
  const { variant: heroVariant, isLoading } = useABVariant('hero-headline')
  const { trackConversion } = useABTestContext()

  // Track hero impressions
  useEffect(() => {
    if (!isLoading) {
      trackConversion('hero-headline', 'hero_impression')
    }
  }, [heroVariant, isLoading, trackConversion])

  const getHeadlineText = () => {
    switch (heroVariant) {
      case 'variant':
        return "Discover Singapore's Best Property Deals"
      default:
        return "Your Trusted Property Investment Guide"
    }
  }

  const getSubtitleText = () => {
    switch (heroVariant) {
      case 'variant':
        return "Get exclusive access to new launches, expert reviews, and insider market insights. Join 10,000+ smart property investors making informed decisions."
      default:
        return "Expert insights, comprehensive reviews, and exclusive analysis to help you make smart property investment decisions in Singapore's dynamic market."
    }
  }

  const handleCTAClick = () => {
    trackConversion('hero-headline', 'hero_cta_click', 1)
  }

  const handleArticleClick = () => {
    trackConversion('hero-headline', 'featured_article_click', 1)
  }

  if (isLoading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-8"></div>
            <div className="h-12 bg-gray-300 rounded w-64"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                Live Market Updates
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {getHeadlineText()}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                {getSubtitleText()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <ABTestCTAButton 
                onClick={handleCTAClick}
                className="sm:w-auto"
                trackingEvent="hero_primary_cta"
                trackingValue={2}
              >
                Get Free Property Report
              </ABTestCTAButton>
              
              <button 
                onClick={() => {
                  handleArticleClick()
                  document.getElementById('latest-insights')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-6 py-4 text-blue-600 font-semibold border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Browse Insights
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">10,000+</span>
                Property Investors
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">50+</span>
                Projects Reviewed
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Daily</span>
                Market Updates
              </div>
            </div>
          </div>

          {/* Right Column - Featured Article */}
          <div className="lg:pl-12">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={featuredArticle.featuredImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 
                  className="text-xl font-bold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={handleArticleClick}
                >
                  {featuredArticle.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3">
                  {featuredArticle.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{featuredArticle.readTime}</span>
                  <button 
                    onClick={handleArticleClick}
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Read Article →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}