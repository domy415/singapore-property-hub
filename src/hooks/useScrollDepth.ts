'use client'

import { useState, useEffect } from 'react'

interface UseScrollDepthOptions {
  threshold?: number
  once?: boolean
}

export function useScrollDepth(options: UseScrollDepthOptions = {}) {
  const { threshold = 0.3, once = true } = options
  const [hasReached, setHasReached] = useState(false)
  const [currentDepth, setCurrentDepth] = useState(0)

  useEffect(() => {
    if (once && hasReached) return

    const calculateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0
      
      setCurrentDepth(scrollPercent)

      if (scrollPercent >= threshold && !hasReached) {
        setHasReached(true)
      }
    }

    // Initial calculation
    calculateScrollDepth()

    // Add scroll listener
    window.addEventListener('scroll', calculateScrollDepth, { passive: true })

    return () => {
      window.removeEventListener('scroll', calculateScrollDepth)
    }
  }, [threshold, hasReached, once])

  return {
    hasReached,
    currentDepth,
    reset: () => setHasReached(false)
  }
}

export function useExitIntent() {
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    // Check session storage
    const wasTriggered = sessionStorage.getItem('exit-intent-triggered') === 'true'
    if (wasTriggered) {
      setHasTriggered(true)
      return
    }

    let exitTimer: NodeJS.Timeout | null = null

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top and moving upward
      if (e.clientY <= 0 && !hasTriggered) {
        exitTimer = setTimeout(() => {
          setHasTriggered(true)
          sessionStorage.setItem('exit-intent-triggered', 'true')
        }, 150)
      }
    }

    const handleMouseEnter = () => {
      if (exitTimer) {
        clearTimeout(exitTimer)
        exitTimer = null
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (exitTimer) {
        clearTimeout(exitTimer)
      }
    }
  }, [hasTriggered])

  return {
    hasTriggered,
    reset: () => {
      setHasTriggered(false)
      sessionStorage.removeItem('exit-intent-triggered')
    }
  }
}

export function useDelayedShow(delay: number = 10000) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return {
    isVisible,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false)
  }
}