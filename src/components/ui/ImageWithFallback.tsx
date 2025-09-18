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

  if (error || !src) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        {fallbackText}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      onError={() => setError(true)}
      onLoad={() => setError(false)}
    />
  )
}