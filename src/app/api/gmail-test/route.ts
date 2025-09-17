import { NextResponse } from 'next/server'

export async function POST() {
  // Build guard: Skip during build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({
      success: false,
      error: 'Gmail test not available during build phase'
    }, { status: 503 });
  }

  try {
    console.log('Testing Gmail SMTP connection...')
    
    // Dynamic import to prevent build-time loading
    const nodemailer = await import('nodemailer')
    
    const transporter = nodemailer.default.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true,
      logger: true,
      tls: {
        rejectUnauthorized: false
      }
    })
    
    // Verify connection first
    await transporter.verify()
    console.log('SMTP connection verified')
    
    // Send simple test email
    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFICATION_EMAIL || 'singaporepropertyhub.com.sg@gmail.com',
      subject: 'Direct Gmail Test - ' + new Date().toLocaleTimeString(),
      text: 'This is a direct Gmail SMTP test.',
      html: '<p>This is a direct Gmail SMTP test at ' + new Date().toLocaleString() + '</p>'
    })
    
    console.log('Email sent:', result.messageId)
    
    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Direct Gmail test successful'
    })
    
  } catch (error: any) {
    console.error('Gmail test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}