'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SuccessAnimationProps {
  show: boolean
  message?: string
  duration?: number
  onComplete?: () => void
  variant?: 'inline' | 'fullscreen' | 'toast'
}

export default function SuccessAnimation({
  show,
  message = 'Success!',
  duration = 3000,
  onComplete,
  variant = 'inline'
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onComplete])

  if (!show && !isVisible) return null

  if (variant === 'fullscreen') {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm',
          'transition-all duration-500',
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className={cn(
            'bg-white rounded-2xl p-8 shadow-2xl',
            'transform transition-all duration-500',
            isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          )}
        >
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-6">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#10B981"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="283"
                  strokeDashoffset="283"
                  className="animate-circle-draw"
                />
              </svg>
              <svg
                className="absolute inset-0 w-full h-full p-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeDasharray="20"
                  strokeDashoffset="20"
                  className="animate-check-draw"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in-up">
              {message}
            </h3>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'toast') {
    return (
      <div
        className={cn(
          'fixed top-4 right-4 z-50',
          'transform transition-all duration-500',
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
      >
        <div className="bg-green-500 text-white rounded-lg shadow-lg px-6 py-4 flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
                className="animate-check-scale"
              />
            </svg>
          </div>
          <p className="font-medium">{message}</p>
        </div>
      </div>
    )
  }

  // Default inline variant
  return (
    <div
      className={cn(
        'flex items-center justify-center p-4',
        'transition-all duration-500',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8">
          <svg
            className="absolute inset-0 w-full h-full animate-spin-slow"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#10B981"
              strokeWidth="8"
              fill="none"
              strokeDasharray="70 200"
            />
          </svg>
          <svg
            className="absolute inset-0 w-full h-full p-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
          >
            <path
              d="M5 13l4 4L19 7"
              className="animate-check-scale"
            />
          </svg>
        </div>
        <span className="text-green-600 font-semibold animate-fade-in">
          {message}
        </span>
      </div>
    </div>
  )
}

// Confetti Success Animation
interface ConfettiSuccessProps {
  show: boolean
  particleCount?: number
}

export function ConfettiSuccess({ show, particleCount = 50 }: ConfettiSuccessProps) {
  const [particles, setParticles] = useState<Array<{ id: number; color: string }>>([])

  useEffect(() => {
    if (show) {
      const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setParticles([])
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, particleCount])

  if (!show && particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            backgroundColor: particle.color,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 1}s`
          }}
        />
      ))}
    </div>
  )
}

// Progress Success Animation
interface ProgressSuccessProps {
  show: boolean
  progress: number
  message?: string
}

export function ProgressSuccess({ show, progress, message }: ProgressSuccessProps) {
  if (!show) return null

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {message || 'Processing...'}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full bg-white/20 animate-shimmer" />
          </div>
        </div>
      </div>
      
      {progress === 100 && (
        <div className="flex items-center justify-center gap-2 text-green-600 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">Complete!</span>
        </div>
      )}
    </div>
  )
}