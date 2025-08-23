'use client'

import { useState } from 'react'
import { Section, Container, H1, H2, Card } from '@/components/design-system'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/emails/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, reason }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
      } else {
        setError(data.error || 'Failed to unsubscribe')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }

    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <Section>
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <Card padding="lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <H1 className="text-green-600 mb-4">Successfully Unsubscribed</H1>
                <p className="text-gray-600 mb-6">
                  You have been successfully unsubscribed from our email list. 
                  You will no longer receive marketing emails from Singapore Property Hub.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  We're sorry to see you go! If you have any feedback on how we could improve, 
                  please don't hesitate to reach out to us at hello@singaporepropertyhub.sg
                </p>
                <a 
                  href="/"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Return to Homepage
                </a>
              </Card>
            </div>
          </Container>
        </Section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Section>
        <Container>
          <div className="max-w-2xl mx-auto">
            <Card padding="lg">
              <div className="text-center mb-8">
                <H1>Unsubscribe from Emails</H1>
                <p className="text-gray-600 mt-4">
                  We're sorry to see you go! Please enter your email address to unsubscribe 
                  from all marketing communications.
                </p>
              </div>

              <form onSubmit={handleUnsubscribe} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-gray-900 mb-2">
                    Reason for Unsubscribing (Optional)
                  </label>
                  <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                  >
                    <option value="">Please select a reason...</option>
                    <option value="too-frequent">Emails are too frequent</option>
                    <option value="not-relevant">Content is not relevant</option>
                    <option value="found-alternative">Found alternative source</option>
                    <option value="no-longer-interested">No longer interested in property</option>
                    <option value="spam">Emails seem like spam</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Changed your mind?
                  </p>
                  <a 
                    href="/"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Return to Homepage
                  </a>
                </div>
              </form>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  )
}