// Responsive Design Validator
// Tests all breakpoints and mobile optimizations

export interface BreakpointTest {
  name: string
  minWidth: number
  maxWidth?: number
  expectedBehavior: string
  isActive: boolean
}

export interface TouchTargetTest {
  element: HTMLElement
  width: number
  height: number
  meetsMinimum: boolean
  meetsRecommended: boolean
}

export interface ResponsiveValidationResult {
  breakpoints: BreakpointTest[]
  touchTargets: TouchTargetTest[]
  viewport: {
    width: number
    height: number
    devicePixelRatio: number
    isTouchDevice: boolean
    orientation: 'portrait' | 'landscape'
  }
  performance: {
    layoutShifts: number
    criticalResources: string[]
    imageOptimization: boolean
  }
  accessibility: {
    safeAreas: boolean
    fontScaling: boolean
    reducedMotion: boolean
    highContrast: boolean
  }
}

export class ResponsiveValidator {
  private breakpoints = [
    { name: 'XS (Small Phones)', minWidth: 320, maxWidth: 479 },
    { name: 'SM (Large Phones)', minWidth: 480, maxWidth: 639 },
    { name: 'MD (Tablets)', minWidth: 640, maxWidth: 767 },
    { name: 'LG (Small Laptops)', minWidth: 768, maxWidth: 1023 },
    { name: 'XL (Laptops)', minWidth: 1024, maxWidth: 1279 },
    { name: '2XL (Large Screens)', minWidth: 1280, maxWidth: 1535 },
    { name: 'Ultra-wide', minWidth: 1536, maxWidth: 1919 },
    { name: 'Ultra-wide+', minWidth: 1920 }
  ]

  public validateCurrentBreakpoints(): BreakpointTest[] {
    const currentWidth = window.innerWidth
    
    return this.breakpoints.map(bp => ({
      name: bp.name,
      minWidth: bp.minWidth,
      maxWidth: bp.maxWidth,
      expectedBehavior: this.getExpectedBehavior(bp.name),
      isActive: currentWidth >= bp.minWidth && (bp.maxWidth ? currentWidth <= bp.maxWidth : true)
    }))
  }

  public validateTouchTargets(): TouchTargetTest[] {
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], .touch-target, .interactive'
    )

    return Array.from(interactiveElements).map(element => {
      const rect = element.getBoundingClientRect()
      const styles = window.getComputedStyle(element as HTMLElement)
      const minHeight = parseInt(styles.minHeight) || rect.height
      const minWidth = parseInt(styles.minWidth) || rect.width

      return {
        element: element as HTMLElement,
        width: Math.max(rect.width, minWidth),
        height: Math.max(rect.height, minHeight),
        meetsMinimum: minHeight >= 44 && minWidth >= 44,
        meetsRecommended: minHeight >= 48 && minWidth >= 48
      }
    })
  }

  public validateViewport() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' as const : 'landscape' as const
    }
  }

  public validatePerformance() {
    const images = document.querySelectorAll('img')
    let optimizedImages = 0

    images.forEach(img => {
      if (img.loading === 'lazy' || img.classList.contains('lazy')) {
        optimizedImages++
      }
    })

    return {
      layoutShifts: this.getCumulativeLayoutShift(),
      criticalResources: this.getCriticalResources(),
      imageOptimization: optimizedImages / images.length > 0.8
    }
  }

  public validateAccessibility() {
    const computedStyle = window.getComputedStyle(document.documentElement)
    
    return {
      safeAreas: this.checkSafeAreaSupport(),
      fontScaling: this.checkFontScaling(),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches
    }
  }

  public async runFullValidation(): Promise<ResponsiveValidationResult> {
    // Wait for layout to stabilize
    await new Promise(resolve => setTimeout(resolve, 100))

    return {
      breakpoints: this.validateCurrentBreakpoints(),
      touchTargets: this.validateTouchTargets(),
      viewport: this.validateViewport(),
      performance: this.validatePerformance(),
      accessibility: this.validateAccessibility()
    }
  }

  private getExpectedBehavior(breakpointName: string): string {
    const behaviors: Record<string, string> = {
      'XS (Small Phones)': '1 column layout, large touch targets, simplified navigation',
      'SM (Large Phones)': '1-2 column layout, hamburger menu, touch-optimized forms',
      'MD (Tablets)': '2-3 column layout, expanded navigation, medium spacing',
      'LG (Small Laptops)': '3-4 column layout, full navigation, desktop patterns',
      'XL (Laptops)': '4-5 column layout, optimal spacing, full feature set',
      '2XL (Large Screens)': 'Max-width container, optimized for large screens',
      'Ultra-wide': 'Constrained width, prevent over-stretching',
      'Ultra-wide+': 'Maximum container width for readability'
    }

    return behaviors[breakpointName] || 'Standard responsive behavior'
  }

  private getCumulativeLayoutShift(): number {
    // This would integrate with Web Vitals API in a real implementation
    return 0
  }

  private getCriticalResources(): string[] {
    const resources: string[] = []
    const performanceEntries = performance.getEntriesByType('resource')
    
    performanceEntries.forEach(entry => {
      if (entry.name.includes('.css') || entry.name.includes('font')) {
        resources.push(entry.name)
      }
    })

    return resources
  }

  private checkSafeAreaSupport(): boolean {
    const testElement = document.createElement('div')
    testElement.style.paddingTop = 'env(safe-area-inset-top)'
    document.body.appendChild(testElement)
    
    const hasSafeArea = testElement.style.paddingTop !== ''
    document.body.removeChild(testElement)
    
    return hasSafeArea
  }

  private checkFontScaling(): boolean {
    // Check if fonts scale appropriately
    const testElement = document.createElement('div')
    testElement.style.fontSize = '1rem'
    testElement.style.position = 'absolute'
    testElement.style.visibility = 'hidden'
    testElement.textContent = 'Test'
    
    document.body.appendChild(testElement)
    const fontSize = parseInt(window.getComputedStyle(testElement).fontSize)
    document.body.removeChild(testElement)
    
    // Good font scaling should result in 16px base font size
    return fontSize >= 16
  }
}

// Utility functions for responsive testing
export function testBreakpoint(width: number): void {
  // This would be used in testing environments to simulate different screen sizes
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

export function generateResponsiveReport(): string {
  const validator = new ResponsiveValidator()
  
  return `
# Responsive Design Validation Report

## Current Viewport
- Width: ${window.innerWidth}px
- Height: ${window.innerHeight}px
- Device Pixel Ratio: ${window.devicePixelRatio}
- Touch Device: ${'ontouchstart' in window ? 'Yes' : 'No'}

## Breakpoint Status
${validator.validateCurrentBreakpoints().map(bp => 
  `- ${bp.name}: ${bp.isActive ? '✅ Active' : '⏸️ Inactive'} (${bp.minWidth}px+)`
).join('\n')}

## Touch Target Analysis
${validator.validateTouchTargets().map(target => 
  `- Element: ${target.element.tagName} - ${target.width}x${target.height}px ${target.meetsMinimum ? '✅' : '❌'}`
).join('\n')}

## Recommendations
- Ensure all interactive elements meet 44x44px minimum
- Test across all breakpoints from 320px to 1920px
- Verify touch gestures work on mobile devices
- Check safe areas on devices with notches
- Validate font scaling for accessibility
`
}

export default ResponsiveValidator