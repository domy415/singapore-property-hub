import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LeadSource, LeadStatus } from '@prisma/client'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  const steps: string[] = []
  
  try {
    steps.push('Starting lead processing')
    
    const leadData = await request.json()
    steps.push('Parsed request data')
    
    // Validate required fields
    if (!leadData.name || !leadData.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required', steps },
        { status: 400 }
      )
    }
    
    steps.push('Validation passed')
    
    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone || null,
        message: leadData.message || null,
        source: LeadSource.WEBSITE,
        status: LeadStatus.NEW
      }
    })
    
    steps.push(`Lead created with ID: ${lead.id}`)
    
    // Try to send email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        steps.push('Creating email transporter')
        
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
        
        steps.push('Sending email to lead')
        
        await transporter.sendMail({
          from: `"Singapore Property Hub" <${process.env.SMTP_USER}>`,
          to: lead.email,
          subject: `Thank you for your interest, ${lead.name}!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Thank you for your interest!</h2>
              <p>Dear ${lead.name},</p>
              <p>We've received your inquiry and will contact you within 24 hours.</p>
              <p>Best regards,<br>The Singapore Property Hub Team</p>
            </div>
          `
        })
        
        steps.push('Email sent successfully')
        
        // Update lead status
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            status: LeadStatus.CONTACTED,
            responseDate: new Date()
          }
        })
        
        steps.push('Lead status updated')
        
      } catch (emailError: any) {
        steps.push(`Email error: ${emailError.message}`)
        // Continue - don't fail the whole process
      }
    }
    
    steps.push('Process completed successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! We\'ll contact you shortly.',
      leadId: lead.id,
      debugSteps: steps
    })
    
  } catch (error: any) {
    steps.push(`Error: ${error.message}`)
    console.error('Lead debug error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process lead',
        details: error.message,
        steps,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}