'use client'

import { useState, useEffect } from 'react'
import { Section, Container, H1, H2, H3, Card, Grid } from '@/components/design-system'

interface EmailStats {
  totalSubscribers: number
  activeSubscribers: number
  totalSent: number
  openRate: number
  clickRate: number
  unsubscribeRate: number
  bounceRate: number
}

interface RecentEmail {
  id: string
  email: string
  type: string
  subject: string
  status: string
  sentAt: string
}

export default function EmailAdminPage() {
  const [stats, setStats] = useState<EmailStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalSent: 0,
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
    bounceRate: 0
  })
  const [recentEmails, setRecentEmails] = useState<RecentEmail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [testEmail, setTestEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadEmailStats()
    loadRecentEmails()
  }, [])

  const loadEmailStats = async () => {
    // This would fetch from API in production
    setStats({
      totalSubscribers: 1247,
      activeSubscribers: 1189,
      totalSent: 5432,
      openRate: 32.4,
      clickRate: 4.2,
      unsubscribeRate: 0.8,
      bounceRate: 1.2
    })
  }

  const loadRecentEmails = async () => {
    // This would fetch from API in production
    setRecentEmails([
      {
        id: '1',
        email: 'john.doe@example.com',
        type: 'welcome',
        subject: 'Welcome to Singapore Property Hub!',
        status: 'delivered',
        sentAt: '2025-01-20T10:30:00Z'
      },
      {
        id: '2',
        email: 'jane.smith@example.com',
        type: 'autoresponder',
        subject: 'Day 1: Your Property Investment Checklist',
        status: 'opened',
        sentAt: '2025-01-20T09:15:00Z'
      },
      {
        id: '3',
        email: 'mike.chen@example.com',
        type: 'lead_notification',
        subject: 'Thank you for your property inquiry',
        status: 'clicked',
        sentAt: '2025-01-20T08:45:00Z'
      }
    ])
    setIsLoading(false)
  }

  const processAutoresponders = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/autoresponders/process', {
        method: 'GET'
      })
      const data = await response.json()
      
      if (data.success) {
        alert('Autoresponders processed successfully!')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error processing autoresponders')
    }
    setIsProcessing(false)
  }

  const sendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testEmail) return

    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          name: 'Test User',
          type: 'welcome'
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Test email sent successfully!')
        setTestEmail('')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error sending test email')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'opened': return 'text-blue-600 bg-blue-100'
      case 'clicked': return 'text-purple-600 bg-purple-100'
      case 'bounced': return 'text-red-600 bg-red-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Section padding="lg">
          <Container>
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 rounded w-64"></div>
              <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Section padding="lg">
        <Container>
          <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <H1>Email Marketing Dashboard</H1>
                <p className="text-gray-600 mt-2">Monitor email campaigns and autoresponder performance</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={processAutoresponders}
                  disabled={isProcessing}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Process Autoresponders'}
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <Grid cols={2} responsive={{ md: 4 }}>
              <Card padding="lg" className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.activeSubscribers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Active Subscribers</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.totalSubscribers.toLocaleString()} total
                </div>
              </Card>

              <Card padding="lg" className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.totalSent.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Emails Sent</div>
                <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
              </Card>

              <Card padding="lg" className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.openRate}%
                </div>
                <div className="text-sm text-gray-600">Open Rate</div>
                <div className="text-xs text-gray-500 mt-1">Industry avg: 22%</div>
              </Card>

              <Card padding="lg" className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.clickRate}%
                </div>
                <div className="text-sm text-gray-600">Click Rate</div>
                <div className="text-xs text-gray-500 mt-1">Industry avg: 2.6%</div>
              </Card>
            </Grid>

            {/* Additional Metrics */}
            <Grid cols={1} responsive={{ md: 3 }}>
              <Card padding="lg">
                <H3 className="mb-4">Email Performance</H3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bounce Rate:</span>
                    <span className="font-semibold text-red-600">{stats.bounceRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Unsubscribe Rate:</span>
                    <span className="font-semibold text-yellow-600">{stats.unsubscribeRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">List Growth:</span>
                    <span className="font-semibold text-green-600">+12.3%</span>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <H3 className="mb-4">Autoresponder Status</H3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Sequences:</span>
                    <span className="font-semibold text-blue-600">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Emails:</span>
                    <span className="font-semibold text-orange-600">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Processed:</span>
                    <span className="font-semibold text-gray-600">2 hours ago</span>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <H3 className="mb-4">Test Email</H3>
                <form onSubmit={sendTestEmail} className="space-y-4">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Enter test email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Send Welcome Email
                  </button>
                </form>
              </Card>
            </Grid>

            {/* Recent Emails */}
            <Card padding="lg">
              <H2 className="mb-6">Recent Email Activity</H2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Sent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEmails.map((email) => (
                      <tr key={email.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm">{email.email}</td>
                        <td className="py-3 px-4 text-sm capitalize">{email.type.replace('_', ' ')}</td>
                        <td className="py-3 px-4 text-sm font-medium">{email.subject}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                            {email.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(email.sentAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  )
}