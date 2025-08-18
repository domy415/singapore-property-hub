import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Singapore Property Hub',
  description: 'Privacy Policy for Singapore Property Hub - Learn how we protect and handle your personal information.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/privacy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">
            Last updated: August 18, 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Singapore Property Hub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website singaporepropertyhub.sg and use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-600 mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Fill out contact forms or lead capture forms</li>
              <li>Subscribe to our newsletter or updates</li>
              <li>Contact us via email</li>
              <li>Interact with our website</li>
            </ul>
            <p className="text-gray-600 mb-4">
              This information may include: name, email address, phone number, and any message or inquiry you submit.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-gray-600 mb-4">
              When you visit our website, we automatically collect certain information, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>IP address and browser information</li>
              <li>Device information and operating system</li>
              <li>Pages viewed and time spent on our website</li>
              <li>Referring website and search terms used</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you property insights, market updates, and relevant content</li>
              <li>Improve our website and user experience</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who help us operate our website and provide services (e.g., email services, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law, legal process, or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale of assets, or acquisition of our business</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Third-Party Links</h2>
            <p className="text-gray-600 mb-4">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Data Retention</h2>
            <p className="text-gray-600 mb-4">
              We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, and resolve disputes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              Under applicable data protection laws, you may have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Access and receive a copy of your personal information</li>
              <li>Rectify inaccurate personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict the processing of your personal information</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-gray-600 mb-4">
              To exercise these rights, please contact us at hello@singaporepropertyhub.sg.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-600 mb-4">
              Email: <a href="mailto:hello@singaporepropertyhub.sg" className="text-blue-600 hover:underline">hello@singaporepropertyhub.sg</a>
            </p>
            <p className="text-gray-600 mb-4">
              Website: <a href="https://singaporepropertyhub.sg" className="text-blue-600 hover:underline">singaporepropertyhub.sg</a>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}