'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  ripple?: boolean
}

export default function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  ripple = true,
  className = '',
  disabled,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      createRipple(e)
    }
    onClick?.(e)
  }

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rippleElement = document.createElement('span')
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    rippleElement.style.width = rippleElement.style.height = `${size}px`
    rippleElement.style.left = `${x}px`
    rippleElement.style.top = `${y}px`
    rippleElement.classList.add('ripple')

    button.appendChild(rippleElement)

    setTimeout(() => {
      rippleElement.remove()
    }, 600)
  }

  const baseStyles = cn(
    'relative overflow-hidden font-semibold rounded-lg',
    'transition-all duration-200 ease-out',
    'transform-gpu will-change-transform',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95'
  )

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const variantStyles = {
    primary: cn(
      'bg-blue-600 text-white',
      'hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5',
      'focus:ring-blue-500'
    ),
    secondary: cn(
      'bg-gray-200 text-gray-900',
      'hover:bg-gray-300 hover:shadow-md hover:-translate-y-0.5',
      'focus:ring-gray-500'
    ),
    outline: cn(
      'border-2 border-blue-600 text-blue-600',
      'hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5',
      'focus:ring-blue-500'
    ),
    ghost: cn(
      'text-gray-700',
      'hover:bg-gray-100 hover:text-gray-900',
      'focus:ring-gray-500'
    )
  }

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      <span className={cn(
        'flex items-center justify-center gap-2',
        loading && 'opacity-0'
      )}>
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
      </span>

      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}

      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  )
}

// Floating Action Button
interface FloatingActionButtonProps {
  children: ReactNode
  onClick?: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
}

export function FloatingActionButton({
  children,
  onClick,
  position = 'bottom-right',
  className = ''
}: FloatingActionButtonProps) {
  const positionStyles = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8'
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed z-50 w-14 h-14 rounded-full shadow-lg',
        'bg-blue-600 text-white',
        'hover:bg-blue-700 hover:shadow-xl hover:scale-110',
        'active:scale-95',
        'transition-all duration-200',
        'flex items-center justify-center',
        'group',
        positionStyles[position],
        className
      )}
    >
      <span className="transform transition-transform duration-200 group-hover:scale-110">
        {children}
      </span>
    </button>
  )
}