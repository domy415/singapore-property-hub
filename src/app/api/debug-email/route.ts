import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST() {
  try {
    console.log('=== EMAIL DEBUG START ===')
    
    // Check environment variables
    const config = {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS ? '***REDACTED***' : 'NOT SET',
      SMTP_PORT: process.env.SMTP_PORT,
      NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL
    }
    
    console.log('Email config:', config)
    
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({
        success: false,
        error: 'Missing SMTP configuration',
        config
      })
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    })
    
    console.log('Transporter created, testing connection...')
    
    // Verify connection
    try {
      await transporter.verify()
      console.log('SMTP connection verified successfully')
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError)
      return NextResponse.json({
        success: false,
        error: 'SMTP verification failed',
        details: verifyError instanceof Error ? verifyError.message : 'Unknown error',
        config
      })
    }
    
    // Try sending a test email
    const testEmail = {
      from: `"Singapore Property Hub" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL || 'singaporepropertyhub.com.sg@gmail.com',
      subject: 'Test Email - Debug',
      html: `
        <h2>Email Test Successful</h2>
        <p>This is a test email sent at ${new Date().toISOString()}</p>
        <p>If you receive this, email notifications are working correctly.</p>
      `
    }
    
    console.log('Sending test email to:', testEmail.to)
    
    const result = await transporter.sendMail(testEmail)
    
    console.log('Email sent successfully:', result.messageId)
    console.log('=== EMAIL DEBUG END ===')
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
      to: testEmail.to,
      config
    })
    
  } catch (error: any) {
    console.error('Email debug error:', error)
    return NextResponse.json({
      success: false,
      error: 'Email debug failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}