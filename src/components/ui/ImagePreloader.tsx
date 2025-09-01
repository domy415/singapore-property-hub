'use client'

import { useEffect } from 'react'

interface ImagePreloaderProps {
  images: Array<{
    src: string
    priority?: boolean
    format?: 'webp' | 'avif' | 'jpeg'
  }>
  preloadAll?: boolean
}

// Preload critical images for better performance
export default function ImagePreloader({ images, preloadAll = false }: ImagePreloaderProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const preloadImage = (src: string, format: string = 'webp') => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      link.type = `image/${format}`
      link.crossOrigin = 'anonymous'
      
      // Add to head
      document.head.appendChild(link)
      
      // Remove after load to prevent memory bloat
      link.onload = () => {
        setTimeout(() => {
          if (document.head.contains(link)) {
            document.head.removeChild(link)
          }
        }, 1000)
      }
    }

    // Preload priority images immediately
    const priorityImages = images.filter(img => img.priority)
    priorityImages.forEach(img => {
      preloadImage(img.src, img.format)
    })

    // Preload remaining images after a short delay
    if (preloadAll) {
      setTimeout(() => {
        const nonPriorityImages = images.filter(img => !img.priority)
        nonPriorityImages.forEach(img => {
          preloadImage(img.src, img.format)
        })
      }, 100)
    }
  }, [images, preloadAll])

  return null // This is a utility component, renders nothing
}

// Hook for programmatic image preloading
export function useImagePreloader() {
  const preloadImages = (urls: string[], format: string = 'webp') => {
    if (typeof window === 'undefined') return

    urls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = url
      link.type = `image/${format}`
      document.head.appendChild(link)
    })
  }

  const preloadCriticalImage = (url: string, format: string = 'webp') => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    link.type = `image/${format}`
    link.fetchPriority = 'high'
    document.head.appendChild(link)
  }

  return { preloadImages, preloadCriticalImage }
}

// Component for preloading hero images above the fold
export function HeroImagePreloader({ src, format = 'webp' }: { src: string; format?: string }) {
  useEffect(() => {
    if (typeof window === 'undefined' || !src) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.type = `image/${format}`
    link.fetchPriority = 'high'
    document.head.appendChild(link)

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [src, format])

  return null
}