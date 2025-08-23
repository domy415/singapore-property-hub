'use client'

import { useState, useRef, useEffect, TouchEvent } from 'react'
import { cn } from '@/lib/utils'

interface SwipeableCardProps {
  children: React.ReactNode[]
  className?: string
  showIndicators?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export default function SwipeableCard({
  children,
  className = '',
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 5000
}: SwipeableCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      handleNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [currentIndex, autoPlay, autoPlayInterval])

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentIndex < children.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }

    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }

    setIsDragging(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % children.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + children.length) % children.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Cards Container */}
      <div
        ref={containerRef}
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={cn(
            'flex transition-transform duration-300',
            isDragging && 'transition-none'
          )}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              style={{ width: '100%' }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Hidden on mobile, shown on tablet+ */}
      <button
        onClick={handlePrevious}
        className={cn(
          'hidden md:flex absolute left-4 top-1/2 -translate-y-1/2',
          'w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg',
          'items-center justify-center transition-all duration-200',
          'hover:scale-110 active:scale-95',
          currentIndex === 0 && 'opacity-50 cursor-not-allowed'
        )}
        disabled={currentIndex === 0}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className={cn(
          'hidden md:flex absolute right-4 top-1/2 -translate-y-1/2',
          'w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg',
          'items-center justify-center transition-all duration-200',
          'hover:scale-110 active:scale-95',
          currentIndex === children.length - 1 && 'opacity-50 cursor-not-allowed'
        )}
        disabled={currentIndex === children.length - 1}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      {showIndicators && children.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                currentIndex === index
                  ? 'w-8 bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Mobile Article Card Carousel
interface MobileArticleCarouselProps {
  articles: Array<{
    id: string
    title: string
    description: string
    image?: string
    date: string
    href: string
  }>
}

export function MobileArticleCarousel({ articles }: MobileArticleCarouselProps) {
  return (
    <div className="md:hidden">
      <SwipeableCard showIndicators={true} className="pb-12">
        {articles.map((article) => (
          <div key={article.id} className="px-4">
            <a
              href={article.href}
              className="block bg-white rounded-xl shadow-md overflow-hidden"
            >
              {article.image && (
                <div className="aspect-video bg-gray-200">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {article.description}
                </p>
                <div className="text-xs text-gray-500">
                  {article.date}
                </div>
              </div>
            </a>
          </div>
        ))}
      </SwipeableCard>
    </div>
  )
}

// Property Card Carousel for Mobile
interface PropertyCarouselProps {
  properties: Array<{
    id: string
    name: string
    price: string
    location: string
    image?: string
    beds?: number
    baths?: number
    size?: string
  }>
}

export function PropertyCarousel({ properties }: PropertyCarouselProps) {
  return (
    <div className="md:hidden">
      <SwipeableCard showIndicators={true} className="pb-12">
        {properties.map((property) => (
          <div key={property.id} className="px-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {property.image && (
                <div className="aspect-[4/3] bg-gray-200">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{property.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">{property.price}</p>
                <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                
                {(property.beds || property.baths || property.size) && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.beds && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.beds} Beds
                      </span>
                    )}
                    {property.baths && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {property.baths} Baths
                      </span>
                    )}
                    {property.size && (
                      <span>{property.size}</span>
                    )}
                  </div>
                )}

                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </SwipeableCard>
    </div>
  )
}