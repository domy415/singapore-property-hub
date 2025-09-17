import nodemailer from 'nodemailer'
import { prisma } from './prisma'
import { EmailStatus } from '@prisma/client'

export interface EmailTemplate {
  id: string
  subject: string
  htmlContent: string
  textContent: string
  variables?: Record<string, string>
}

export interface EmailRecipient {
  email: string
  name?: string
  variables?: Record<string, string>
}

export interface AutoresponderSequence {
  id: string
  name: string
  emails: {
    id: string
    delay: number // hours after signup
    templateId: string
    subject: string
    isActive: boolean
  }[]
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })

      // Verify connection
      await this.transporter.verify()
      console.log('Email service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize email service:', error)
      this.transporter = null
    }
  }

  async sendEmail({
    to,
    subject,
    html,
    text,
    from = process.env.FROM_EMAIL || 'hello@singaporepropertyhub.sg'
  }: {
    to: string
    subject: string
    html: string
    text?: string
    from?: string
  }) {
    if (!this.transporter) {
      throw new Error('Email service not initialized')
    }

    try {
      const result = await this.transporter.sendMail({
        from: `Singapore Property Hub <${from}>`,
        to,
        subject,
        html,
        text: text || this.htmlToText(html)
      })

      console.log('Email sent successfully:', result.messageId)
      return result
    } catch (error) {
      console.error('Failed to send email:', error)
      throw error
    }
  }

  async sendWelcomeEmail(email: string, name?: string) {
    const template = this.getWelcomeEmailTemplate(name || 'Property Investor')
    
    try {
      await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent
      })

      // Track email sent
      await this.trackEmailSent(email, 'welcome', template.id)
      
      // Start autoresponder sequence
      await this.startAutoresponderSequence(email, 'property-investor-sequence')
      
      return true
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      throw error
    }
  }

  async sendLeadNotification(leadData: any) {
    const template = this.getLeadNotificationTemplate(leadData)
    
    try {
      // Send to admin
      await this.sendEmail({
        to: process.env.ADMIN_EMAIL || 'hello@singaporepropertyhub.sg',
        subject: template.adminSubject,
        html: template.adminHtml,
        text: template.adminText
      })

      // Send auto-reply to user
      await this.sendEmail({
        to: leadData.email,
        subject: template.userSubject,
        html: template.userHtml,
        text: template.userText
      })

      // Track emails sent
      await this.trackEmailSent(leadData.email, 'lead_notification', 'lead-notification')
      await this.trackEmailSent(process.env.ADMIN_EMAIL || 'hello@singaporepropertyhub.sg', 'admin_notification', 'admin-notification')

      return true
    } catch (error) {
      console.error('Failed to send lead notification:', error)
      throw error
    }
  }

  async startAutoresponderSequence(email: string, sequenceId: string) {
    const sequence = this.getAutoresponderSequence(sequenceId)
    
    if (!sequence) {
      console.warn(`Autoresponder sequence not found: ${sequenceId}`)
      return
    }

    try {
      // Store autoresponder subscription in database
      await prisma.emailSubscription.upsert({
        where: { email },
        update: {
          sequenceId,
          sequenceStarted: new Date(),
          isActive: true
        },
        create: {
          email,
          sequenceId,
          sequenceStarted: new Date(),
          isActive: true,
          currentStep: 0
        }
      })

      console.log(`Started autoresponder sequence ${sequenceId} for ${email}`)
    } catch (error) {
      console.error('Failed to start autoresponder sequence:', error)
    }
  }

  async processAutoresponders() {
    try {
      const subscriptions = await prisma.emailSubscription.findMany({
        where: {
          isActive: true
        }
      })

      for (const subscription of subscriptions) {
        await this.processSubscriptionEmails(subscription)
      }
    } catch (error) {
      console.error('Failed to process autoresponders:', error)
    }
  }

  private async processSubscriptionEmails(subscription: any) {
    const sequence = this.getAutoresponderSequence(subscription.sequenceId)
    if (!sequence) return

    const now = new Date()
    const startTime = new Date(subscription.sequenceStarted)
    const hoursSinceStart = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60)

    // Find emails that should be sent
    const emailsToSend = sequence.emails.filter(email => 
      email.isActive && 
      email.delay <= hoursSinceStart &&
      !subscription.sentEmails?.includes(email.id)
    )

    for (const emailConfig of emailsToSend) {
      try {
        const template = this.getEmailTemplate(emailConfig.templateId)
        if (!template) continue

        await this.sendEmail({
          to: subscription.email,
          subject: emailConfig.subject,
          html: template.htmlContent,
          text: template.textContent
        })

        // Mark email as sent
        await prisma.emailSubscription.update({
          where: { id: subscription.id },
          data: {
            sentEmails: {
              push: emailConfig.id
            },
            currentStep: subscription.currentStep + 1
          }
        })

        await this.trackEmailSent(subscription.email, 'autoresponder', emailConfig.templateId)
        
        console.log(`Sent autoresponder email ${emailConfig.id} to ${subscription.email}`)
      } catch (error) {
        console.error(`Failed to send autoresponder email ${emailConfig.id}:`, error)
      }
    }
  }

  private async trackEmailSent(email: string, type: string, templateId: string) {
    try {
      await prisma.emailLog.create({
        data: {
          email,
          type,
          templateId,
          sentAt: new Date(),
          status: EmailStatus.SENT
        }
      })
    } catch (error) {
      console.error('Failed to track email:', error)
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    try {
      const subscription = await prisma.emailSubscription.findUnique({
        where: { email }
      })
      return !!subscription?.isActive
    } catch (error) {
      console.error('Failed to check email subscription:', error)
      return false
    }
  }

  async unsubscribeEmail(email: string) {
    try {
      await prisma.emailSubscription.update({
        where: { email },
        data: { isActive: false, unsubscribedAt: new Date() }
      })
      return true
    } catch (error) {
      console.error('Failed to unsubscribe email:', error)
      return false
    }
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()
  }

  private getWelcomeEmailTemplate(name: string): EmailTemplate {
    return {
      id: 'welcome-email',
      subject: 'Welcome to Singapore Property Hub! 🏠 Your Free Property Guide Inside',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Singapore Property Hub</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3B82F6, #1E40AF); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Singapore Property Hub! 🏠</h1>
            <p style="color: #E5E7EB; margin: 10px 0 0 0; font-size: 16px;">Your trusted guide to Singapore's property market</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #1E40AF; margin-top: 0;">Hi ${name}! 👋</h2>
            <p>Thank you for joining our community of smart property investors! You're now part of 10,000+ property enthusiasts who rely on our expert insights.</p>
            <p><strong>Here's what you can expect:</strong></p>
            <ul style="padding-left: 20px;">
              <li>🔥 <strong>Daily Market Insights</strong> - Stay ahead with the latest property trends</li>
              <li>📊 <strong>New Launch Reviews</strong> - Detailed analysis of every major development</li>
              <li>💡 <strong>Investment Tips</strong> - Strategies from successful property investors</li>
              <li>📍 <strong>District Guides</strong> - Comprehensive location analysis for all 28 districts</li>
              <li>🎯 <strong>Exclusive Deals</strong> - Early access to developer promotions</li>
            </ul>
          </div>

          <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #1E40AF; margin-top: 0;">🎁 Your Welcome Gift is Ready!</h3>
            <p style="margin-bottom: 15px;"><strong>2025 Singapore Property Investment Guide (32 pages)</strong></p>
            <p>This comprehensive guide covers:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Cooling measures impact analysis</li>
              <li>Best districts for capital appreciation</li>
              <li>Rental yield calculations by property type</li>
              <li>2025 market outlook and predictions</li>
            </ul>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://singapore-property-hub.vercel.app/guide/download" style="background: #3B82F6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Download Your Free Guide 📥</a>
            </div>
          </div>

          <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #1E40AF; margin-top: 0;">🚀 Get Started Immediately</h3>
            <div style="margin-bottom: 15px;">
              <a href="https://singapore-property-hub.vercel.app/new-launches" style="color: #3B82F6; text-decoration: none; font-weight: bold;">→ Browse Latest New Launches</a>
            </div>
            <div style="margin-bottom: 15px;">
              <a href="https://singapore-property-hub.vercel.app/articles" style="color: #3B82F6; text-decoration: none; font-weight: bold;">→ Read Expert Market Analysis</a>
            </div>
            <div style="margin-bottom: 15px;">
              <a href="https://singapore-property-hub.vercel.app/districts" style="color: #3B82F6; text-decoration: none; font-weight: bold;">→ Explore District Guides</a>
            </div>
          </div>

          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
              Questions? Simply reply to this email - we read and respond to every message!
            </p>
            <p style="color: #6B7280; font-size: 14px; margin: 10px 0 0 0;">
              Best regards,<br>
              <strong>Singapore Property Hub Team</strong>
            </p>
          </div>
        </body>
        </html>
      `,
      textContent: `
Welcome to Singapore Property Hub! 🏠

Hi ${name}! 👋

Thank you for joining our community of smart property investors! You're now part of 10,000+ property enthusiasts who rely on our expert insights.

Here's what you can expect:
• Daily Market Insights - Stay ahead with the latest property trends
• New Launch Reviews - Detailed analysis of every major development  
• Investment Tips - Strategies from successful property investors
• District Guides - Comprehensive location analysis for all 28 districts
• Exclusive Deals - Early access to developer promotions

🎁 Your Welcome Gift is Ready!
2025 Singapore Property Investment Guide (32 pages)

Download your free guide: https://singapore-property-hub.vercel.app/guide/download

Get Started Immediately:
→ Browse Latest New Launches: https://singapore-property-hub.vercel.app/new-launches
→ Read Expert Market Analysis: https://singapore-property-hub.vercel.app/articles  
→ Explore District Guides: https://singapore-property-hub.vercel.app/districts

Questions? Simply reply to this email - we read and respond to every message!

Best regards,
Singapore Property Hub Team
      `
    }
  }

  private getLeadNotificationTemplate(leadData: any) {
    return {
      adminSubject: `New Lead: ${leadData.name} - ${leadData.propertyJourney || 'Property Inquiry'}`,
      adminHtml: `
        <h2>New Lead Received</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Name:</strong> ${leadData.name}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          <p><strong>Phone:</strong> ${leadData.phone || 'Not provided'}</p>
          <p><strong>Property Journey:</strong> ${leadData.propertyJourney || 'Not specified'}</p>
          <p><strong>Budget:</strong> ${leadData.budget || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${leadData.timeline || 'Not specified'}</p>
          <p><strong>Message:</strong> ${leadData.message || 'No message'}</p>
          <p><strong>Source:</strong> ${leadData.source || 'Website'}</p>
          <p><strong>Lead Score:</strong> ${leadData.leadScore || 'Not calculated'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
      adminText: `New Lead: ${leadData.name} (${leadData.email})`,
      userSubject: 'Thank you for your property inquiry - We\'ll be in touch within 24 hours',
      userHtml: `
        <h2>Thank you for your interest, ${leadData.name}!</h2>
        <p>We've received your property inquiry and our team will review it shortly.</p>
        <p><strong>What happens next:</strong></p>
        <ul>
          <li>Our property experts will analyze your requirements</li>
          <li>We'll prepare personalized recommendations based on your criteria</li>
          <li>You'll receive a detailed response within 24 hours</li>
        </ul>
        <p>In the meantime, feel free to explore our latest insights and property reviews.</p>
        <p>Best regards,<br>Singapore Property Hub Team</p>
      `,
      userText: `Thank you ${leadData.name}! We'll respond to your property inquiry within 24 hours.`
    }
  }

  private getAutoresponderSequence(sequenceId: string): AutoresponderSequence | null {
    const sequences: Record<string, AutoresponderSequence> = {
      'property-investor-sequence': {
        id: 'property-investor-sequence',
        name: 'Property Investor Welcome Series',
        emails: [
          {
            id: 'day-1-guide',
            delay: 24, // 1 day
            templateId: 'day-1-investment-guide',
            subject: '📊 Your Property Investment Checklist (Day 1)',
            isActive: true
          },
          {
            id: 'day-3-mistakes',
            delay: 72, // 3 days  
            templateId: 'day-3-common-mistakes',
            subject: '⚠️ 5 Costly Property Mistakes to Avoid (Day 3)',
            isActive: true
          },
          {
            id: 'day-7-districts',
            delay: 168, // 7 days
            templateId: 'day-7-district-guide',
            subject: '🗺️ Best Property Districts for 2025 (Week 1)',
            isActive: true
          },
          {
            id: 'day-14-financing',
            delay: 336, // 14 days
            templateId: 'day-14-financing-guide',
            subject: '💰 Property Financing Made Simple (Week 2)',
            isActive: true
          }
        ]
      }
    }

    return sequences[sequenceId] || null
  }

  private getEmailTemplate(templateId: string): EmailTemplate | null {
    const templates: Record<string, EmailTemplate> = {
      'day-1-investment-guide': {
        id: 'day-1-investment-guide',
        subject: '📊 Your Property Investment Checklist',
        htmlContent: `
          <h2>Day 1: Your Property Investment Checklist 📊</h2>
          <p>Ready to start your property investment journey? Here's your essential checklist:</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3>Before You Start:</h3>
            <ul>
              <li>✅ Calculate your maximum budget (including ABSD)</li>
              <li>✅ Get mortgage pre-approval</li>
              <li>✅ Research your target districts</li>
              <li>✅ Understand cooling measures</li>
              <li>✅ Set your investment timeline</li>
            </ul>
          </div>
          <p><a href="https://singapore-property-hub.vercel.app/investment-guide">Read the full investment guide →</a></p>
        `,
        textContent: 'Day 1: Your Property Investment Checklist...'
      },
      'day-3-common-mistakes': {
        id: 'day-3-common-mistakes',
        subject: '⚠️ 5 Costly Property Mistakes to Avoid',
        htmlContent: `
          <h2>Day 3: 5 Costly Property Mistakes to Avoid ⚠️</h2>
          <p>Learn from others' expensive mistakes:</p>
          <div style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 20px;">
            <h3>Top 5 Mistakes:</h3>
            <ol>
              <li>Not calculating total costs upfront</li>
              <li>Buying during peak market cycles</li>
              <li>Ignoring rental yield potential</li>
              <li>Overlooking future development plans</li>
              <li>Not understanding ABSD implications</li>
            </ol>
          </div>
          <p><a href="https://singapore-property-hub.vercel.app/mistakes-guide">Avoid these mistakes →</a></p>
        `,
        textContent: 'Day 3: 5 Costly Property Mistakes to Avoid...'
      }
    }

    return templates[templateId] || null
  }
}

// Lazy initialization to prevent build-time execution
let _emailService: EmailService | null = null

export function getEmailService(): EmailService {
  // Enhanced build guard for email service
  const isBuildPhase = 
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NODE_ENV === 'test' ||
    process.env.SKIP_BUILD_STATIC_GENERATION === 'true'

  if (isBuildPhase) {
    console.log('🚫 Skipping email service initialization during build phase')
    // Return a mock service during build
    return {
      sendWelcomeEmail: async () => { throw new Error('Email service not available during build') },
      sendLeadNotification: async () => { throw new Error('Email service not available during build') },
      processAutoresponders: async () => { throw new Error('Email service not available during build') },
      unsubscribeEmail: async () => { throw new Error('Email service not available during build') },
      isEmailSubscribed: async () => { throw new Error('Email service not available during build') }
    } as any
  }

  if (!_emailService) {
    console.log('✅ Initializing email service for runtime')
    _emailService = new EmailService()
  }
  return _emailService
}

// Simple email validation function
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Proxy object for backward compatibility with existing imports
export const emailService = {
  sendWelcomeEmail: (email: string, name?: string) => getEmailService().sendWelcomeEmail(email, name),
  sendLeadNotification: (leadData: any) => getEmailService().sendLeadNotification(leadData),
  processAutoresponders: () => getEmailService().processAutoresponders(),
  unsubscribeEmail: (email: string) => getEmailService().unsubscribeEmail(email),
  isEmailSubscribed: (email: string) => getEmailService().isEmailSubscribed(email),
  validateEmail: (email: string) => validateEmail(email)
}