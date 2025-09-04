/**
 * Monitoring and Alerting System
 * Tracks system health and prevents silent failures
 */

export interface AlertData {
  timestamp: string
  component: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  reason: string
  environment: string
  url?: string
  metadata?: Record<string, any>
}

export function logDatabaseFallback(component: string, reason: string, metadata?: Record<string, any>) {
  const alertData: AlertData = {
    timestamp: new Date().toISOString(),
    component,
    severity: 'high',
    reason,
    environment: process.env.NODE_ENV || 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    metadata
  }
  
  console.warn('🚨 DATABASE FALLBACK TRIGGERED:', alertData)
  
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    sendToMonitoringService(alertData)
  }
  
  return alertData
}

export function logImageComplianceIssue(articleId: string, title: string, issues: string[]) {
  const alertData: AlertData = {
    timestamp: new Date().toISOString(),
    component: 'ImageValidator',
    severity: 'medium',
    reason: 'Image compliance violation detected',
    environment: process.env.NODE_ENV || 'unknown',
    metadata: {
      articleId,
      title,
      issues
    }
  }
  
  console.warn('🖼️ IMAGE COMPLIANCE ISSUE:', alertData)
  
  if (process.env.NODE_ENV === 'production') {
    sendToMonitoringService(alertData)
  }
  
  return alertData
}

export function logSystemHealthCheck(health: any) {
  const alertData: AlertData = {
    timestamp: new Date().toISOString(),
    component: 'HealthChecker',
    severity: health.status === 'healthy' ? 'low' : 'high',
    reason: `System health check: ${health.status}`,
    environment: process.env.NODE_ENV || 'unknown',
    metadata: health
  }
  
  if (health.status !== 'healthy') {
    console.error('🏥 SYSTEM HEALTH WARNING:', alertData)
    
    if (process.env.NODE_ENV === 'production') {
      sendToMonitoringService(alertData)
    }
  } else {
    console.log('✅ System health check passed')
  }
  
  return alertData
}

async function sendToMonitoringService(alertData: AlertData) {
  try {
    // Send to internal monitoring endpoint
    await fetch('/api/monitoring/alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData)
    })
  } catch (error) {
    console.error('Failed to send alert to monitoring service:', error)
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private timers: Map<string, number> = new Map()
  
  start(label: string) {
    this.timers.set(label, performance.now())
  }
  
  end(label: string): number {
    const startTime = this.timers.get(label)
    if (!startTime) {
      console.warn(`Performance timer "${label}" was not started`)
      return 0
    }
    
    const duration = performance.now() - startTime
    this.timers.delete(label)
    
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
    
    // Alert on slow operations
    if (duration > 5000) { // 5 seconds
      logDatabaseFallback('PerformanceMonitor', `Slow operation detected: ${label}`, {
        duration,
        threshold: 5000
      })
    }
    
    return duration
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Health check scheduler
export function scheduleHealthChecks() {
  if (typeof window !== 'undefined') {
    // Client-side health checks
    setInterval(async () => {
      try {
        const response = await fetch('/api/health')
        if (!response.ok) {
          logDatabaseFallback('HealthScheduler', 'Health check endpoint failed', {
            status: response.status,
            statusText: response.statusText
          })
        }
      } catch (error) {
        logDatabaseFallback('HealthScheduler', 'Health check request failed', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }, 300000) // Every 5 minutes
  }
}

// Error boundary integration
export function logComponentError(component: string, error: Error, errorInfo?: any) {
  const alertData: AlertData = {
    timestamp: new Date().toISOString(),
    component: `ErrorBoundary:${component}`,
    severity: 'critical',
    reason: 'React component error',
    environment: process.env.NODE_ENV || 'unknown',
    metadata: {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo
    }
  }
  
  console.error('💥 COMPONENT ERROR:', alertData)
  
  if (process.env.NODE_ENV === 'production') {
    sendToMonitoringService(alertData)
  }
}