// Singapore Property Hub Design System
// Comprehensive design tokens and utilities

export const designSystem = {
  // Typography Scale with Clamp Functions
  typography: {
    // Font families
    fontFamily: {
      primary: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      heading: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      body: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    },

    // Font sizes with responsive clamp functions
    fontSize: {
      hero: 'clamp(2.5rem, 5vw, 4rem)',        // 40px - 64px
      h1: 'clamp(2rem, 4vw, 3rem)',            // 32px - 48px
      h2: 'clamp(1.5rem, 3vw, 2.25rem)',       // 24px - 36px
      h3: 'clamp(1.25rem, 2.5vw, 1.75rem)',    // 20px - 28px
      h4: 'clamp(1.125rem, 2vw, 1.5rem)',      // 18px - 24px
      h5: 'clamp(1rem, 1.5vw, 1.25rem)',       // 16px - 20px
      h6: '1.125rem',                           // 18px
      body: '1.0625rem',                        // 17px
      bodyLarge: '1.125rem',                    // 18px
      bodySmall: '0.9375rem',                   // 15px
      caption: '0.875rem',                      // 14px
      small: '0.8125rem',                       // 13px
      xs: '0.75rem',                            // 12px
    },

    // Font weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },

    // Line heights for optimal readability
    lineHeight: {
      tight: '1.25',      // 125% - for large headings
      snug: '1.375',      // 137.5% - for subheadings
      normal: '1.5',      // 150% - for body text
      relaxed: '1.625',   // 162.5% - for long-form content
      loose: '1.75',      // 175% - for captions/small text
    },

    // Letter spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Spacing System (based on 8px grid)
  spacing: {
    // Base spacing units
    px: '1px',
    0: '0',
    0.5: '0.125rem',    // 2px
    1: '0.25rem',       // 4px
    1.5: '0.375rem',    // 6px
    2: '0.5rem',        // 8px
    2.5: '0.625rem',    // 10px
    3: '0.75rem',       // 12px
    3.5: '0.875rem',    // 14px
    4: '1rem',          // 16px - elements gap
    5: '1.25rem',       // 20px
    6: '1.5rem',        // 24px - cards padding
    7: '1.75rem',       // 28px
    8: '2rem',          // 32px
    9: '2.25rem',       // 36px
    10: '2.5rem',       // 40px
    11: '2.75rem',      // 44px
    12: '3rem',         // 48px
    14: '3.5rem',       // 56px
    16: '4rem',         // 64px
    20: '5rem',         // 80px
    24: '6rem',         // 96px - sections padding
    28: '7rem',         // 112px
    32: '8rem',         // 128px
    36: '9rem',         // 144px
    40: '10rem',        // 160px
    44: '11rem',        // 176px
    48: '12rem',        // 192px
    52: '13rem',        // 208px
    56: '14rem',        // 224px
    60: '15rem',        // 240px
    64: '16rem',        // 256px
    72: '18rem',        // 288px
    80: '20rem',        // 320px
    96: '24rem',        // 384px

    // Semantic spacing
    elementGap: '1rem',     // 16px - gaps between elements
    cardPadding: '1.5rem',  // 24px - internal card padding
    sectionPadding: '6rem', // 96px - section vertical padding
  },

  // Color System
  colors: {
    // Primary colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },

    // Neutral colors
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },

    // Semantic colors
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },

    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },

    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Container max widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Animation durations
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
} as const

// Type definitions
export type DesignSystem = typeof designSystem

// Utility functions for accessing design tokens
export const getSpacing = (key: keyof typeof designSystem.spacing) => designSystem.spacing[key]
export const getColor = (color: string, shade?: number) => {
  if (shade) {
    return (designSystem.colors as any)[color]?.[shade] || color
  }
  return (designSystem.colors as any)[color] || color
}
export const getFontSize = (key: keyof typeof designSystem.typography.fontSize) => designSystem.typography.fontSize[key]
export const getLineHeight = (key: keyof typeof designSystem.typography.lineHeight) => designSystem.typography.lineHeight[key]

// CSS custom properties generator
export const generateCSSCustomProperties = () => {
  const cssVars: Record<string, string> = {}

  // Typography
  Object.entries(designSystem.typography.fontSize).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value
  })

  Object.entries(designSystem.typography.lineHeight).forEach(([key, value]) => {
    cssVars[`--line-height-${key}`] = value
  })

  // Spacing
  Object.entries(designSystem.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value
  })

  // Colors
  Object.entries(designSystem.colors.primary).forEach(([key, value]) => {
    cssVars[`--color-primary-${key}`] = value
  })

  Object.entries(designSystem.colors.neutral).forEach(([key, value]) => {
    cssVars[`--color-neutral-${key}`] = value
  })

  return cssVars
}

// Responsive typography utility
export const responsiveText = (size: keyof typeof designSystem.typography.fontSize) => ({
  fontSize: designSystem.typography.fontSize[size],
  lineHeight: size.startsWith('h') || size === 'hero' 
    ? designSystem.typography.lineHeight.tight 
    : designSystem.typography.lineHeight.normal,
  fontFamily: designSystem.typography.fontFamily.primary.join(', '),
})

// Spacing utility
export const spacing = (size: keyof typeof designSystem.spacing) => designSystem.spacing[size]

export default designSystem