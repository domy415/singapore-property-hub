'use client'

import { useState, useEffect } from 'react'
import MobileHeader from './MobileHeader'
import StickyCTABar from '@/components/mobile/StickyCTABar'
import { useBreakpoint } from '@/lib/breakpoints'
import { cn } from '@/lib/utils'

interface ResponsiveLayoutProps {
  children: React.ReactNode
  showCTA?: boolean
  ctaVariant?: 'default' | 'property' | 'contact' | 'newsletter'
  className?: string
}

export default function ResponsiveLayout({
  children,
  showCTA = true,
  ctaVariant = 'property',
  className = ''
}: ResponsiveLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const breakpoint = useBreakpoint()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Desktop Header would go here */}
      <div className="desktop-only">
        {/* Desktop header component */}
      </div>

      {/* Main Content */}
      <main className={cn(
        'relative',
        // Add bottom padding on mobile for sticky CTA
        showCTA && breakpoint.mobile && 'pb-24'
      )}>
        {children}
      </main>

      {/* Sticky CTA Bar for Mobile */}
      {showCTA && (
        <StickyCTABar 
          variant={ctaVariant}
          showOnlyOnMobile={true}
        />
      )}
    </div>
  )
}

// Mobile-first grid system
interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = ''
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  return (
    <div className={cn(
      'grid',
      `grid-cols-${cols.mobile}`,
      cols.tablet && `md:grid-cols-${cols.tablet}`,
      cols.desktop && `lg:grid-cols-${cols.desktop}`,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Mobile-first container
interface ResponsiveContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export function ResponsiveContainer({
  children,
  size = 'lg',
  className = ''
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  }

  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  )
}

// Mobile-optimized section
interface ResponsiveSectionProps {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  background?: 'white' | 'gray' | 'blue' | 'transparent'
  className?: string
}

export function ResponsiveSection({
  children,
  padding = 'lg',
  background = 'transparent',
  className = ''
}: ResponsiveSectionProps) {
  const paddingClasses = {
    none: '',
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-20'
  }

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    blue: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    transparent: 'bg-transparent'
  }

  return (
    <section className={cn(
      paddingClasses[padding],
      backgroundClasses[background],
      className
    )}>
      <ResponsiveContainer>
        {children}
      </ResponsiveContainer>
    </section>
  )
}

// Responsive text sizing
interface ResponsiveTextProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  align?: 'left' | 'center' | 'right'
  className?: string
}

export function ResponsiveText({
  children,
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  className = ''
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl',
    '5xl': 'text-5xl sm:text-6xl'
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-500'
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <Component className={cn(
      sizeClasses[size],
      weightClasses[weight],
      colorClasses[color],
      alignClasses[align],
      className
    )}>
      {children}
    </Component>
  )
}