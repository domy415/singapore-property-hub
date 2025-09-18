'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  fallbackText?: string
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  width, 
  height, 
  fill = false,
  className = '',
  fallbackText = 'Image not available'
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  if (error || !src) {
    return (
      <div 
        className={`bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-gray-600 text-sm ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        <div className="flex flex-col items-center space-y-2">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-xs font-medium">{fallbackText}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {loading && (
        <div 
          className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}
          style={!fill ? { width, height } : undefined}
        >
          <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
        onLoad={() => {
          setError(false)
          setLoading(false)
        }}
      />
    </>
  )
}