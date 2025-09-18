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
        className={`bg-gray-200 flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        <div className="flex flex-col items-center space-y-2">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">{fallbackText}</span>
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