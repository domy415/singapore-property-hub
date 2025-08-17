import { NextResponse } from 'next/server'

export async function GET() {
  const emailConfig = {
    hasSmtpHost: !!process.env.SMTP_HOST,
    hasSmtpUser: !!process.env.SMTP_USER,
    hasSmtpPass: !!process.env.SMTP_PASS,
    smtpPort: process.env.SMTP_PORT,
    notificationEmail: process.env.NOTIFICATION_EMAIL,
    nodeEnv: process.env.NODE_ENV
  }

  return NextResponse.json({
    success: true,
    config: emailConfig,
    message: 'Email configuration check'
  })
}