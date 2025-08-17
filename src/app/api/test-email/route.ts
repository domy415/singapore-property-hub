import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  try {
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
    
    // Verify connection
    await transporter.verify()
    console.log('SMTP connection verified successfully')
    
    // Send test email
    const info = await transporter.sendMail({
      from: `"Singapore Property Hub Test" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL || 'test@example.com',
      subject: 'Test Email from Singapore Property Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test Email Successful!</h2>
          <p>This is a test email from your Singapore Property Hub website.</p>
          <p>If you're receiving this, your email configuration is working correctly.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    })
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      accepted: info.accepted
    })
  } catch (error: any) {
    console.error('Email test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        code: error.code,
        command: error.command
      },
      { status: 500 }
    )
  }
}