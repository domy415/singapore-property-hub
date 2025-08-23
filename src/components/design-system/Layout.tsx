import React from 'react'
import { cn } from '@/lib/utils'

// Layout Components using the Design System

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function Container({ children, className, size = 'xl' }: ContainerProps) {
  const sizeClasses = {
    sm: 'container-sm',
    md: 'container-md', 
    lg: 'container-lg',
    xl: 'container-xl',
    '2xl': 'container-2xl',
    full: 'container'
  }

  return (
    <div className={cn(sizeClasses[size], className)}>
      {children}
    </div>
  )
}

interface SectionProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  background?: 'white' | 'light' | 'navy' | 'transparent'
  as?: keyof JSX.IntrinsicElements
}

export function Section({ 
  children, 
  className, 
  padding = 'md',
  background = 'transparent',
  as = 'section' 
}: SectionProps) {
  const Component = as

  const paddingClasses = {
    sm: 'section-sm',
    md: 'section',
    lg: 'section-lg'
  }

  const backgroundClasses = {
    white: 'bg-[var(--bg-white)]',
    light: 'bg-[var(--bg-light)]',
    navy: 'bg-[var(--bg-navy)] text-white',
    transparent: 'bg-transparent'
  }

  return (
    <Component className={cn(
      paddingClasses[padding],
      backgroundClasses[background],
      className
    )}>
      <Container>
        {children}
      </Container>
    </Component>
  )
}

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  hover?: boolean
  as?: keyof JSX.IntrinsicElements
}

export function Card({ 
  children, 
  className, 
  padding = 'md',
  shadow = 'md',
  border = false,
  hover = false,
  as = 'div'
}: CardProps) {
  const Component = as

  const paddingClasses = {
    sm: 'card-sm',
    md: 'card',
    lg: 'card-lg'
  }

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }

  const hoverClasses = hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
  const borderClasses = border ? 'border border-[var(--color-neutral-200)]' : ''

  return (
    <Component className={cn(
      'bg-[var(--bg-white)] rounded-xl',
      paddingClasses[padding],
      shadowClasses[shadow],
      borderClasses,
      hoverClasses,
      className
    )}>
      {children}
    </Component>
  )
}

interface StackProps {
  children: React.ReactNode
  className?: string
  gap?: 'sm' | 'md' | 'lg'
  as?: keyof JSX.IntrinsicElements
}

export function Stack({ children, className, gap = 'md', as = 'div' }: StackProps) {
  const Component = as
  
  const gapClasses = {
    sm: 'stack-sm',
    md: 'stack',
    lg: 'stack-lg'
  }

  return (
    <Component className={cn(gapClasses[gap], className)}>
      {children}
    </Component>
  )
}

interface FlexProps {
  children: React.ReactNode
  className?: string
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
  gap?: boolean
  as?: keyof JSX.IntrinsicElements
}

export function Flex({ 
  children, 
  className, 
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = false,
  as = 'div'
}: FlexProps) {
  const Component = as

  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  }

  return (
    <Component className={cn(
      'flex',
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      wrap && 'flex-wrap',
      gap && 'flex-gap',
      className
    )}>
      {children}
    </Component>
  )
}

interface GridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: boolean
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6
    md?: 1 | 2 | 3 | 4 | 5 | 6
    lg?: 1 | 2 | 3 | 4 | 5 | 6
    xl?: 1 | 2 | 3 | 4 | 5 | 6
  }
  as?: keyof JSX.IntrinsicElements
}

export function Grid({ 
  children, 
  className, 
  cols = 1,
  gap = true,
  responsive,
  as = 'div'
}: GridProps) {
  const Component = as

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }

  const responsiveClasses = responsive ? [
    responsive.sm && `sm:grid-cols-${responsive.sm}`,
    responsive.md && `md:grid-cols-${responsive.md}`,
    responsive.lg && `lg:grid-cols-${responsive.lg}`,
    responsive.xl && `xl:grid-cols-${responsive.xl}`
  ].filter(Boolean) : []

  return (
    <Component className={cn(
      'grid',
      colClasses[cols],
      ...responsiveClasses,
      gap && 'grid-gap',
      className
    )}>
      {children}
    </Component>
  )
}

interface SpacerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  axis?: 'x' | 'y' | 'both'
}

export function Spacer({ size = 'md', axis = 'y' }: SpacerProps) {
  const sizeMap = {
    sm: '1rem',
    md: '2rem', 
    lg: '3rem',
    xl: '4rem'
  }

  const spacing = sizeMap[size]

  const style = {
    x: { width: spacing },
    y: { height: spacing },
    both: { width: spacing, height: spacing }
  }[axis]

  return <div style={style} aria-hidden="true" />
}

// Divider component
interface DividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  color?: 'light' | 'medium' | 'dark'
}

export function Divider({ className, orientation = 'horizontal', color = 'light' }: DividerProps) {
  const colorClasses = {
    light: 'border-[var(--color-neutral-200)]',
    medium: 'border-[var(--color-neutral-300)]',
    dark: 'border-[var(--color-neutral-400)]'
  }

  return (
    <div 
      className={cn(
        'border-0',
        orientation === 'horizontal' ? 'border-t w-full h-0' : 'border-l h-full w-0',
        colorClasses[color],
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  )
}