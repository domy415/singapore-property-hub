// Breakpoint definitions matching Tailwind CSS
export const breakpoints = {
  xs: '320px',   // Small phones
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Laptops
  '2xl': '1536px' // Large screens
} as const

export type Breakpoint = keyof typeof breakpoints

// Custom breakpoints for specific use cases
export const customBreakpoints = {
  mobile: '320px',      // Mobile first
  phablet: '480px',     // Large phones
  tablet: '768px',      // Tablets
  laptop: '1024px',     // Laptops
  desktop: '1280px',    // Desktops
  wide: '1440px',       // Wide screens
  ultrawide: '1920px'   // Ultra-wide screens
} as const

// Media query helpers
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.sm})`,
  tablet: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.lg})`,
  desktop: `@media (min-width: ${breakpoints.lg})`,
  
  // Touch devices
  touch: '@media (hover: none) and (pointer: coarse)',
  hover: '@media (hover: hover) and (pointer: fine)',
  
  // Orientation
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  // Display features
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Accessibility
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  highContrast: '@media (prefers-contrast: high)',
  darkMode: '@media (prefers-color-scheme: dark)',
} as const

// Responsive utility functions
export function isBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(min-width: ${breakpoints[breakpoint]})`).matches
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(max-width: ${breakpoints.sm})`).matches
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.lg})`).matches
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(min-width: ${breakpoints.lg})`).matches
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

// Hook for responsive behavior
export function useBreakpoint() {
  if (typeof window === 'undefined') {
    return {
      mobile: false,
      tablet: false,
      desktop: false,
      touch: false,
      current: 'sm' as Breakpoint
    }
  }

  const mobile = isMobile()
  const tablet = isTablet()
  const desktop = isDesktop()
  const touch = isTouchDevice()

  let current: Breakpoint = 'sm'
  if (window.innerWidth >= parseInt(breakpoints['2xl'])) current = '2xl'
  else if (window.innerWidth >= parseInt(breakpoints.xl)) current = 'xl'
  else if (window.innerWidth >= parseInt(breakpoints.lg)) current = 'lg'
  else if (window.innerWidth >= parseInt(breakpoints.md)) current = 'md'
  else if (window.innerWidth >= parseInt(breakpoints.sm)) current = 'sm'
  else current = 'xs' as Breakpoint

  return { mobile, tablet, desktop, touch, current }
}

// Container max-widths for different breakpoints
export const containerSizes = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px'
} as const

// Grid system
export const gridCols = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
  wide: 4
} as const

// Touch target sizes (minimum recommended sizes)
export const touchTargets = {
  minimum: '44px',    // WCAG AA minimum
  recommended: '48px', // Better UX
  comfortable: '56px'  // Most comfortable
} as const

// Safe areas for devices with notches/rounded corners
export const safeAreas = {
  top: 'env(safe-area-inset-top)',
  right: 'env(safe-area-inset-right)',
  bottom: 'env(safe-area-inset-bottom)',
  left: 'env(safe-area-inset-left)'
} as const