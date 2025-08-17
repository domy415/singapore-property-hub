import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  try {
    // Quick non-blocking test
    const testConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? 'SET' : 'NOT SET',
      }
    }
    
    // Check if we can create transporter (doesn't actually connect)
    const transporter = nodemailer.createTransport({
      host: testConfig.host,
      port: testConfig.port,
      secure: testConfig.secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Email configuration check completed',
      config: testConfig,
      smtp_host_env: process.env.SMTP_HOST,
      smtp_user_env: process.env.SMTP_USER,
      smtp_pass_set: !!process.env.SMTP_PASS,
      notification_email: process.env.NOTIFICATION_EMAIL
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}