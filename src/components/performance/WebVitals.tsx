'use client'

import { useEffect } from 'react'
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

interface VitalsMetric {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

function sendToAnalytics(metric: VitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 Web Vital - ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id
    })
  }

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'web_vital', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      value: Math.round(metric.value),
      custom_map: { metric_rating: metric.rating }
    })
  }

  // Send to Vercel Analytics if available
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', {
      name: 'web-vital',
      data: {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating
      }
    })
  }
}

export default function WebVitals() {
  useEffect(() => {
    // Core Web Vitals
    onLCP(sendToAnalytics) // Largest Contentful Paint
    onFID(sendToAnalytics) // First Input Delay  
    onCLS(sendToAnalytics) // Cumulative Layout Shift

    // Additional metrics
    onFCP(sendToAnalytics) // First Contentful Paint
    onTTFB(sendToAnalytics) // Time to First Byte
  }, [])

  // Performance observer for additional monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Monitor long tasks that could impact performance
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'longtask') {
              console.warn('🐌 Long task detected:', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              })
            }
          })
        })

        observer.observe({ entryTypes: ['longtask'] })

        return () => observer.disconnect()
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }, [])

  return null // This component doesn't render anything
}

// Performance monitoring hooks
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Monitor resource loading
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (perfData) {
        const metrics = {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          ttfb: perfData.responseStart - perfData.requestStart,
          download: perfData.responseEnd - perfData.responseStart,
          domLoad: perfData.domContentLoadedEventEnd - perfData.fetchStart,
          windowLoad: perfData.loadEventEnd - perfData.fetchStart
        }

        console.log('📊 Navigation Timing:', metrics)

        // Alert if any metric is concerning
        if (metrics.ttfb > 600) {
          console.warn('⚠️ High TTFB detected:', metrics.ttfb, 'ms')
        }
        if (metrics.domLoad > 1500) {
          console.warn('⚠️ Slow DOM load detected:', metrics.domLoad, 'ms')
        }
      }
    })
  }, [])
}

// Critical resource preloading
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  // Preload critical images
  const criticalImages = [
    '/images/og-default.jpg',
    '/images/hero-bg.jpg'
  ]

  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })

  // Prefetch likely next pages
  const prefetchRoutes = [
    '/condos',
    '/districts',
    '/guides'
  ]

  prefetchRoutes.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  })
}