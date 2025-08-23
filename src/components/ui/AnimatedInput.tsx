'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  success?: boolean
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, icon, success, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const hasValue = props.value && String(props.value).length > 0

    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none',
              'text-gray-600',
              isFocused || hasValue
                ? '-top-2.5 text-xs bg-white px-1 text-blue-600'
                : 'top-3.5 text-base'
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
              isFocused ? 'text-blue-600' : 'text-gray-400'
            )}>
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 border-2 rounded-lg',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus:ring-0',
              'placeholder-transparent',
              icon && 'pl-10',
              isFocused && 'border-blue-500 shadow-sm',
              error && 'border-red-500 focus:border-red-500',
              success && 'border-green-500 focus:border-green-500',
              !error && !success && !isFocused && 'border-gray-300 hover:border-gray-400',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Animated underline */}
          <div
            className={cn(
              'absolute bottom-0 left-0 h-0.5 bg-blue-600',
              'transition-all duration-300 ease-out',
              isFocused ? 'w-full' : 'w-0'
            )}
          />
        </div>

        {/* Error message with animation */}
        {error && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down">
            {error}
          </p>
        )}

        {/* Success indicator */}
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="w-5 h-5 text-green-500 animate-scale-in"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
    )
  }
)

AnimatedInput.displayName = 'AnimatedInput'

export default AnimatedInput

// Animated Select Component
interface AnimatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

export const AnimatedSelect = forwardRef<HTMLSelectElement, AnimatedSelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const hasValue = props.value && String(props.value).length > 0

    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none z-10',
              'text-gray-600',
              isFocused || hasValue
                ? '-top-2.5 text-xs bg-white px-1 text-blue-600'
                : 'top-3.5 text-base'
            )}
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border-2 rounded-lg appearance-none',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-0',
            'bg-white',
            isFocused && 'border-blue-500 shadow-sm',
            error && 'border-red-500 focus:border-red-500',
            !error && !isFocused && 'border-gray-300 hover:border-gray-400',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={cn(
              'w-5 h-5 transition-all duration-200',
              isFocused ? 'text-blue-600 rotate-180' : 'text-gray-400'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down">
            {error}
          </p>
        )}
      </div>
    )
  }
)

AnimatedSelect.displayName = 'AnimatedSelect'

// Animated Textarea Component
interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const AnimatedTextarea = forwardRef<HTMLTextAreaElement, AnimatedTextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const hasValue = props.value && String(props.value).length > 0

    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none',
              'text-gray-600',
              isFocused || hasValue
                ? '-top-2.5 text-xs bg-white px-1 text-blue-600'
                : 'top-3.5 text-base'
            )}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border-2 rounded-lg resize-none',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-0',
            isFocused && 'border-blue-500 shadow-sm',
            error && 'border-red-500 focus:border-red-500',
            !error && !isFocused && 'border-gray-300 hover:border-gray-400',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down">
            {error}
          </p>
        )}
      </div>
    )
  }
)

AnimatedTextarea.displayName = 'AnimatedTextarea'