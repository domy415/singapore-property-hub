'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { useABVariant, useABTestContext } from '@/context/ABTestContext'
import { cn } from '@/lib/utils'

interface ABTestButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  trackingEvent?: string
  trackingValue?: number
}

const ABTestButton = forwardRef<HTMLButtonElement, ABTestButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    trackingEvent = 'button_click',
    trackingValue,
    onClick,
    ...props 
  }, ref) => {
    const { variant: colorVariant } = useABVariant('button-color')
    const { trackConversion } = useABTestContext()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Track A/B test conversion
      trackConversion('button-color', trackingEvent, trackingValue)
      
      // Call original onClick
      if (onClick) {
        onClick(e)
      }
    }

    // Base styles
    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    // Size variants
    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg'
    }

    // Color variants based on A/B test
    const getColorStyles = () => {
      const isGold = colorVariant === 'gold'
      
      switch (variant) {
        case 'primary':
          return isGold 
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl focus:ring-blue-500'
        case 'secondary':
          return isGold
            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300 focus:ring-yellow-500'
            : 'bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 focus:ring-blue-500'
        case 'outline':
          return isGold
            ? 'border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-white focus:ring-yellow-500'
            : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500'
        default:
          return isGold 
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl focus:ring-blue-500'
      }
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          getColorStyles(),
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)

ABTestButton.displayName = 'ABTestButton'

export default ABTestButton

// Specialized CTA button for forms
export function ABTestCTAButton({ 
  children, 
  className,
  ...props 
}: Omit<ABTestButtonProps, 'variant' | 'size'>) {
  return (
    <ABTestButton 
      variant="primary" 
      size="lg" 
      className={cn('w-full', className)}
      trackingEvent="cta_click"
      {...props}
    >
      {children}
    </ABTestButton>
  )
}

// Quick action button for smaller interactions
export function ABTestActionButton({ 
  children, 
  className,
  ...props 
}: Omit<ABTestButtonProps, 'variant' | 'size'>) {
  return (
    <ABTestButton 
      variant="secondary" 
      size="md" 
      className={className}
      trackingEvent="action_click"
      {...props}
    >
      {children}
    </ABTestButton>
  )
}