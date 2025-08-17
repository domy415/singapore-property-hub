import { NextResponse } from 'next/server'

export async function GET() {
  // Check which environment variables are set (without exposing values)
  const envStatus = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    SMTP_HOST: !!process.env.SMTP_HOST,
    SMTP_PORT: !!process.env.SMTP_PORT,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASS: !!process.env.SMTP_PASS,
    NOTIFICATION_EMAIL: !!process.env.NOTIFICATION_EMAIL,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  }
  
  return NextResponse.json({
    success: true,
    environment: envStatus,
    emailConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    message: 'Environment variables status'
  })
}