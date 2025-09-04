import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const alertData = await request.json()
    
    // Log the alert
    console.log('🚨 MONITORING ALERT RECEIVED:', {
      timestamp: alertData.timestamp,
      component: alertData.component,
      severity: alertData.severity,
      reason: alertData.reason,
      environment: alertData.environment
    })
    
    // In a production environment, you would:
    // 1. Send to external monitoring service (Sentry, DataDog, etc.)
    // 2. Store in database for historical tracking
    // 3. Send notifications (email, Slack, etc.) based on severity
    // 4. Create incident tickets for critical issues
    
    if (alertData.severity === 'critical') {
      console.error('🔥 CRITICAL ALERT - IMMEDIATE ACTION REQUIRED:', alertData)
      
      // Example: Send to external service
      // await sendToSentry(alertData)
      // await sendSlackNotification(alertData)
      // await createIncidentTicket(alertData)
    }
    
    if (alertData.severity === 'high') {
      console.warn('⚠️ HIGH PRIORITY ALERT - ATTENTION NEEDED:', alertData)
      
      // Example: Send notification
      // await sendSlackNotification(alertData)
    }
    
    // Store alert in memory for demo purposes
    // In production, store in database or external service
    const globalAny = global as any
    globalAny.monitoringAlerts = globalAny.monitoringAlerts || []
    globalAny.monitoringAlerts.push({
      ...alertData,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })
    
    // Keep only last 100 alerts in memory
    if (globalAny.monitoringAlerts.length > 100) {
      globalAny.monitoringAlerts = globalAny.monitoringAlerts.slice(-100)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Alert received and processed',
      alertId: globalAny.monitoringAlerts[globalAny.monitoringAlerts.length - 1]?.id
    })
    
  } catch (error) {
    console.error('Failed to process monitoring alert:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process alert',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Get recent alerts
export async function GET() {
  try {
    const globalAny = global as any
    const alerts = globalAny.monitoringAlerts || []
    
    return NextResponse.json({
      success: true,
      alerts: alerts.slice(-20), // Last 20 alerts
      total: alerts.length
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve alerts'
    }, { status: 500 })
  }
}