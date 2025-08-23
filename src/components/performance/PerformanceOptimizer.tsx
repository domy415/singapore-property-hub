'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PerformanceMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
}

interface PerformanceOptimizerProps {
  children: React.ReactNode
  prefetchRoutes?: string[]
  criticalImages?: string[]
}

export default function PerformanceOptimizer({
  children,
  prefetchRoutes = [],
  criticalImages = []
}: PerformanceOptimizerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  })
  const router = useRouter()

  // Initialize performance monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Prefetch critical resources
    prefetchCriticalResources(criticalImages)

    // Prefetch likely routes
    prefetchRoutes.forEach(route => {
      router.prefetch(route)
    })

    // Setup intersection observer for lazy loading optimization
    setupIntersectionObserver()

    // Monitor long tasks
    monitorLongTasks()

    return () => {
      // Cleanup observers
    }
  }, [router, prefetchRoutes, criticalImages])

  return (
    <>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceDebugger metrics={metrics} />
      )}
    </>
  )
}

function prefetchCriticalResources(images: string[]) {
  images.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })

  // Preload critical CSS
  const criticalCSS = [
    '/_next/static/css/critical.css'
  ]

  criticalCSS.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    document.head.appendChild(link)
  })
}

function setupIntersectionObserver() {
  if (!('IntersectionObserver' in window)) return

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.classList.remove('image-blur-load')
          img.classList.add('loaded')
          imageObserver.unobserve(img)
        }
      }
    })
  }, {
    rootMargin: '50px',
    threshold: 0.1
  })

  // Observe all images with data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img)
  })
}

function monitorLongTasks() {
  if (!('PerformanceObserver' in window)) return

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'longtask') {
          console.warn('🐌 Long Task Detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          })

          // Send to analytics if available
          if ((window as any).gtag) {
            (window as any).gtag('event', 'long_task', {
              event_category: 'Performance',
              value: Math.round(entry.duration),
              custom_map: { task_name: entry.name }
            })
          }
        }
      })
    })

    observer.observe({ entryTypes: ['longtask'] })
  } catch (e) {
    console.warn('Long task monitoring not supported')
  }
}

function PerformanceDebugger({ metrics }: { metrics: PerformanceMetrics }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleDebugger = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', toggleDebugger)
    return () => window.removeEventListener('keydown', toggleDebugger)
  }, [])

  if (!isVisible) return null

  const getScoreColor = (value: number | null, thresholds: [number, number]) => {
    if (value === null) return 'text-gray-500'
    if (value <= thresholds[0]) return 'text-green-600'
    if (value <= thresholds[1]) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-lg p-4 border border-gray-200 z-[9999] max-w-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold">Core Web Vitals</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getScoreColor(metrics.lcp, [2500, 4000])}>
            {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'Measuring...'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={getScoreColor(metrics.fid, [100, 300])}>
            {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'Measuring...'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getScoreColor(metrics.cls ? metrics.cls * 1000 : null, [100, 250])}>
            {metrics.cls ? metrics.cls.toFixed(3) : 'Measuring...'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getScoreColor(metrics.fcp, [1800, 3000])}>
            {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'Measuring...'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getScoreColor(metrics.ttfb, [800, 1800])}>
            {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'Measuring...'}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  )
}

// Hook for component-level performance optimization
export function usePerformanceOptimization() {
  useEffect(() => {
    // Optimize scroll performance
    let ticking = false
    
    const optimizedScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll-based optimizations here
          ticking = false
        })
        ticking = true
      }
    }

    // Throttle scroll events
    window.addEventListener('scroll', optimizedScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', optimizedScroll)
    }
  }, [])

  // Return performance utilities
  return {
    preloadImage: (src: string) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    },
    
    markInteractive: () => {
      if ('performance' in window && 'mark' in performance) {
        performance.mark('component-interactive')
      }
    }
  }
}