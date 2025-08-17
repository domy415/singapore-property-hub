import { PrismaClient, LeadStatus, LeadSource } from '@prisma/client'
import nodemailer from 'nodemailer'
import OpenAI from 'openai'

const prisma = new PrismaClient()
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

interface EmailTemplate {
  subject: string
  body: string
  followUpDays?: number
}

export class LeadManager {
  private transporter: nodemailer.Transporter
  private agentEmail: string = process.env.NOTIFICATION_EMAIL || 'agent@singaporepropertyhub.sg'
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
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
      
      // Send automated response (only if SMTP is configured)
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          await this.sendAutomatedResponse(lead)
          
          // Notify agent if qualified
          if (this.isQualifiedLead(lead)) {
            await this.notifyAgent(lead)
          }
        } catch (emailError) {
          console.error('Email sending failed:', emailError)
          // Continue even if email fails
        }
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
    const emailTemplate = await this.generatePersonalizedEmail(lead)
    
    await this.transporter.sendMail({
      from: '"Singapore Property Hub" <noreply@singaporepropertyhub.sg>',
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
    const property = lead.propertyId ? 
      await prisma.property.findUnique({ where: { id: lead.propertyId } }) : 
      null
    
    const agentNotification = `
      <h2>New Qualified Lead Alert!</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
      <p><strong>Message:</strong> ${lead.message || 'No message'}</p>
      ${property ? `<p><strong>Property Interest:</strong> ${property.title}</p>` : ''}
      <p><strong>Lead Score:</strong> High</p>
      <p><strong>Action Required:</strong> Please follow up within 24 hours</p>
    `
    
    await this.transporter.sendMail({
      from: '"Lead Notification System" <system@singaporepropertyhub.sg>',
      to: this.agentEmail,
      subject: `🔥 New Qualified Lead: ${lead.name}`,
      html: agentNotification,
      priority: 'high'
    })
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