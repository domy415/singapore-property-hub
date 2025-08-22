import { LeadStatus, LeadSource } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

interface EmailTemplate {
  subject: string
  body: string
  followUpDays?: number
}

export class LeadManager {
  private transporter: nodemailer.Transporter | null
  private agentEmail: string = process.env.NOTIFICATION_EMAIL || 'agent@singaporepropertyhub.sg'
  
  constructor() {
    // Only create transporter if SMTP credentials are provided
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false
          },
          debug: true,
          logger: true
        })
        console.log('Email transporter configured successfully')
      } catch (error) {
        console.error('Failed to create email transporter:', error)
        this.transporter = null
      }
    } else {
      console.log('Email configuration not found. Email notifications will be skipped.')
      this.transporter = null
    }
  }
  
  async processNewLead(leadData: {
    name: string
    email: string
    phone?: string
    message?: string
    propertyId?: string
    source: LeadSource
  }) {
    try {
      // Save lead to database
      const lead = await prisma.lead.create({
        data: leadData
      })
      
      console.log('Lead saved to database:', lead.id)
      
      // Send automated response (only if SMTP is configured and transporter exists)
      if (this.transporter) {
        try {
          await this.sendAutomatedResponse(lead)
          console.log('Automated response sent to:', lead.email)
          
          // Always notify agent for all leads
          await this.notifyAgent(lead)
          console.log('Agent notification sent for new lead')
        } catch (emailError) {
          console.error('Email sending failed:', emailError)
          // Continue even if email fails - lead is already saved
        }
      } else {
        console.log('Email notifications skipped - no transporter configured')
      }
      
      // Schedule follow-up
      await this.scheduleFollowUp(lead)
      
      return lead
    } catch (error) {
      console.error('Database error in processNewLead:', error)
      throw error
    }
  }
  
  private async sendAutomatedResponse(lead: any) {
    if (!this.transporter) {
      console.log('Skipping email - no transporter')
      return
    }

    const emailTemplate = await this.generatePersonalizedEmail(lead)
    
    try {
      await this.transporter.sendMail({
        from: `"Singapore Property Hub" <${process.env.SMTP_USER || 'noreply@singaporepropertyhub.sg'}>`,
        to: lead.email,
        subject: emailTemplate.subject,
        html: emailTemplate.body,
      })
      
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          status: LeadStatus.CONTACTED,
          responseDate: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to send automated response:', error)
      throw error
    }
  }
  
  private async generatePersonalizedEmail(lead: any): Promise<EmailTemplate> {
    let context = 'general inquiry'
    
    if (lead.propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: lead.propertyId }
      })
      context = `inquiry about ${property?.title || 'a specific property'}`
    }

    // If OpenAI is not available, use a default template
    if (!openai) {
      return {
        subject: `Thank you for your interest, ${lead.name}!`,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank you for your interest!</h2>
            <p>Dear ${lead.name},</p>
            <p>Thank you for reaching out to Singapore Property Hub regarding your ${context}.</p>
            <p>We appreciate your interest and will get back to you within 24 hours with detailed information and personalized recommendations.</p>
            <p>In the meantime, feel free to browse our latest property listings on our website.</p>
            <p>Best regards,<br>
            The Singapore Property Hub Team</p>
            <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">
                📧 Email: info@singaporepropertyhub.sg<br>
                📱 Phone: +65 6123 4567<br>
                🌐 Website: singaporepropertyhub.sg
              </p>
            </div>
          </div>
        `
      }
    }
    
    try {
      const prompt = `Generate a personalized email response for a potential property buyer in Singapore.

Lead Information:
- Name: ${lead.name}
- Context: ${context}
- Message: ${lead.message || 'No specific message'}

Create a warm, professional email that:
1. Thanks them for their interest
2. Acknowledges their specific needs (if mentioned)
3. Provides relevant information about Singapore property market
4. Offers to schedule a consultation
5. Includes a call-to-action

Format as JSON:
{
  "subject": "Email subject line",
  "body": "HTML formatted email body"
}`

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional Singapore property agent crafting personalized responses to potential clients."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
      
      return JSON.parse(response.choices[0].message.content || '{}')
    } catch (error) {
      console.error('OpenAI generation failed, using default template:', error)
      // Fall back to default template
      return {
        subject: `Thank you for your interest, ${lead.name}!`,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank you for your interest!</h2>
            <p>Dear ${lead.name},</p>
            <p>Thank you for reaching out to Singapore Property Hub regarding your ${context}.</p>
            <p>We appreciate your interest and will get back to you within 24 hours with detailed information and personalized recommendations.</p>
            <p>In the meantime, feel free to browse our latest property listings on our website.</p>
            <p>Best regards,<br>
            The Singapore Property Hub Team</p>
          </div>
        `
      }
    }
  }
  
  private isQualifiedLead(lead: any): boolean {
    // Lead scoring logic
    let score = 0
    
    if (lead.phone) score += 20
    if (lead.message && lead.message.length > 50) score += 30
    if (lead.propertyId) score += 40
    if (lead.source === LeadSource.PROPERTY_INQUIRY) score += 30
    
    return score >= 60
  }
  
  private async notifyAgent(lead: any) {
    if (!this.transporter) {
      console.log('Skipping agent notification - no transporter')
      return
    }

    const property = lead.propertyId ? 
      await prisma.property.findUnique({ where: { id: lead.propertyId } }) : 
      null
    
    // Convert newlines in message to HTML breaks
    const formattedMessage = lead.message ? 
      lead.message.replace(/\n/g, '<br>').replace(/\r\n/g, '<br>') : 
      'No message'
    
    const agentNotification = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Lead Alert!</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${lead.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${lead.email}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
          <p style="margin: 10px 0 5px 0;"><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px;">
            ${formattedMessage}
          </div>
          ${property ? `<p style="margin: 10px 0 5px 0;"><strong>Property Interest:</strong> ${property.title}</p>` : ''}
        </div>
        <p><strong>Action Required:</strong> Please follow up within 24 hours</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          This notification was sent from Singapore Property Hub's lead management system.
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          Singapore Property Hub Team
        </p>
      </div>
    `
    
    try {
      await this.transporter.sendMail({
        from: `"Lead Notification System" <${process.env.SMTP_USER || 'system@singaporepropertyhub.sg'}>`,
        to: this.agentEmail,
        subject: `🔥 New Qualified Lead: ${lead.name}`,
        html: agentNotification,
        priority: 'high'
      })
    } catch (error) {
      console.error('Failed to send agent notification:', error)
      // Don't throw - this is not critical
    }
  }
  
  private async scheduleFollowUp(lead: any) {
    // This would integrate with a job scheduler like node-cron
    // For now, we'll just mark it for follow-up
    const followUpDate = new Date()
    followUpDate.setDate(followUpDate.getDate() + 3)
    
    // In production, this would create a scheduled job
    console.log(`Follow-up scheduled for ${lead.email} on ${followUpDate}`)
  }
  
  async getLeadStats() {
    const totalLeads = await prisma.lead.count()
    const qualifiedLeads = await prisma.lead.count({
      where: { status: LeadStatus.QUALIFIED }
    })
    const convertedLeads = await prisma.lead.count({
      where: { status: LeadStatus.CONVERTED }
    })
    
    return {
      total: totalLeads,
      qualified: qualifiedLeads,
      converted: convertedLeads,
      conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(2) : 0
    }
  }
}