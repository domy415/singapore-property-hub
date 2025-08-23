'use client'

import { ReactNode } from 'react'
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  hover?: boolean
  onClick?: () => void
}

export default function AnimatedCard({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  hover = true,
  onClick
}: AnimatedCardProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ delay })

  const getAnimationClass = () => {
    const baseAnimation = 'transition-all duration-700 ease-out'
    
    const directionClasses = {
      up: isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
      down: isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0',
      left: isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0',
      right: isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0',
      fade: isVisible ? 'opacity-100' : 'opacity-0'
    }

    return cn(baseAnimation, directionClasses[direction])
  }

  const hoverClass = hover ? 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1' : ''
  const clickClass = onClick ? 'cursor-pointer active:scale-[0.98]' : ''

  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-xl shadow-md transition-all duration-200',
        getAnimationClass(),
        hoverClass,
        clickClass,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Animated Grid Container for staggered animations
interface AnimatedGridProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
  columns?: number
}

export function AnimatedGrid({
  children,
  className = '',
  staggerDelay = 100,
  columns = 3
}: AnimatedGridProps) {
  const { setRef, visibleItems } = useStaggeredAnimation<HTMLDivElement>(
    children.length,
    staggerDelay
  )

  return (
    <div className={cn(`grid grid-cols-1 md:grid-cols-${columns} gap-6`, className)}>
      {children.map((child, index) => (
        <div
          key={index}
          ref={setRef(index)}
          className={cn(
            'transition-all duration-700 ease-out',
            visibleItems[index]
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Animated Section Wrapper
interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  bgColor?: string
}

export function AnimatedSection({
  children,
  className = '',
  bgColor = 'bg-white'
}: AnimatedSectionProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>()

  return (
    <section
      ref={ref}
      className={cn(
        'py-16 transition-all duration-1000',
        bgColor,
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </section>
  )
}