import React from 'react'
import { cn } from '@/lib/utils'

// Typography Components using the Design System

interface TypographyProps {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

// Hero Text Component
export function HeroText({ children, className, as = 'h1' }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn('hero-text', className)}>
      {children}
    </Component>
  )
}

// Heading Components
export function H1({ children, className, as = 'h1' }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn('h1', className)}>
      {children}
    </Component>
  )
}

export function H2({ children, className, as = 'h2' }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn('h2', className)}>
      {children}
    </Component>
  )
}

export function H3({ children, className, as = 'h3' }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn('h3', className)}>
      {children}
    </Component>
  )
}

export function H4({ children, className, as = 'h4' }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn('h4', className)}>
      {children}
    </Component>
  )
}

export function H5({ children, className, as = 'h5' }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn('h5', className)}>
      {children}
    </Component>
  )
}

export function H6({ children, className, as = 'h6' }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn('h6', className)}>
      {children}
    </Component>
  )
}

// Body Text Components
export function BodyText({ children, className, as = 'p' }: TypographyProps) {
  const Component = as
  return (
    <Component 
      className={cn('text-[var(--font-size-body)] leading-[var(--line-height-normal)]', className)}
      style={{ 
        fontSize: 'var(--font-size-body)', 
        lineHeight: 'var(--line-height-normal)' 
      }}
    >
      {children}
    </Component>
  )
}

export function BodyLarge({ children, className, as = 'p' }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn('body-large', className)}>
      {children}
    </Component>
  )
}

export function BodySmall({ children, className, as = 'p' }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn('body-small', className)}>
      {children}
    </Component>
  )
}

export function Caption({ children, className, as = 'span' }: TypographyProps) {
  const Component = as
  return (
    <Component className={cn('caption', className)}>
      {children}
    </Component>
  )
}

// Utility component for consistent text styling
interface TextProps extends TypographyProps {
  variant?: 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-large' | 'body-small' | 'caption'
  color?: 'primary' | 'secondary' | 'white' | 'inherit'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
}

export function Text({ 
  children, 
  className, 
  as, 
  variant = 'body',
  color = 'primary',
  weight = 'normal'
}: TextProps) {
  // Map variant to semantic HTML elements if as is not provided
  const defaultElement = {
    hero: 'h1',
    h1: 'h1',
    h2: 'h2', 
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body: 'p',
    'body-large': 'p',
    'body-small': 'p',
    caption: 'span'
  }[variant] as keyof JSX.IntrinsicElements

  const Component = as || defaultElement

  const colorClasses = {
    primary: 'text-[var(--text-primary)]',
    secondary: 'text-[var(--text-secondary)]',
    white: 'text-white',
    inherit: 'text-inherit'
  }

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  return (
    <Component 
      className={cn(
        variant === 'hero' && 'hero-text',
        variant === 'h1' && 'h1',
        variant === 'h2' && 'h2',
        variant === 'h3' && 'h3',
        variant === 'h4' && 'h4',
        variant === 'h5' && 'h5',
        variant === 'h6' && 'h6',
        variant === 'body' && 'text-[var(--font-size-body)] leading-[var(--line-height-normal)]',
        variant === 'body-large' && 'body-large',
        variant === 'body-small' && 'body-small',
        variant === 'caption' && 'caption',
        colorClasses[color],
        weightClasses[weight],
        className
      )}
      style={{
        ...(variant === 'body' && { 
          fontSize: 'var(--font-size-body)', 
          lineHeight: 'var(--line-height-normal)' 
        })
      }}
    >
      {children}
    </Component>
  )
}