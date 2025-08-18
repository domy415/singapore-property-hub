import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Singapore Property Hub',
  description: 'Terms of Service for Singapore Property Hub - Learn about the terms and conditions for using our website.',
  alternates: {
    canonical: 'https://singaporepropertyhub.sg/terms',
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">
            Last updated: August 18, 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Singapore Property Hub ("the Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. About Our Service</h2>
            <p className="text-gray-600 mb-4">
              Singapore Property Hub is a platform operated by property enthusiasts who share insights, analysis, and educational content about Singapore's real estate market. We are not licensed real estate agents or financial advisors.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily access the materials on Singapore Property Hub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for commercial purposes or for public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Disclaimer</h2>
            <p className="text-gray-600 mb-4">
              The materials on Singapore Property Hub are provided on an 'as is' basis. Singapore Property Hub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Not Professional Advice</h2>
            <p className="text-gray-600 mb-4">
              The information provided on this website is for educational and informational purposes only. It should not be considered as professional financial, legal, or real estate advice. We strongly recommend consulting with qualified professionals before making any property investment decisions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Investment Risk Disclaimer</h2>
            <p className="text-gray-600 mb-4">
              Property investment involves risk, and past performance does not guarantee future results. Property values can fluctuate, and you may lose money. Any investment decisions should be made based on your own research and consultation with qualified professionals.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. User Content and Conduct</h2>
            <p className="text-gray-600 mb-4">
              When using our contact forms or submitting information, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Provide accurate and truthful information</li>
              <li>Not submit any harmful, offensive, or illegal content</li>
              <li>Respect the privacy and rights of others</li>
              <li>Not use the service for spam or commercial solicitation</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Third-Party Content and Links</h2>
            <p className="text-gray-600 mb-4">
              Our website may include content from third parties (such as quotes from property experts or links to external websites). We do not endorse or take responsibility for any third-party content or the accuracy of external websites.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitations</h2>
            <p className="text-gray-600 mb-4">
              In no event shall Singapore Property Hub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Singapore Property Hub, even if Singapore Property Hub or its authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Accuracy of Materials</h2>
            <p className="text-gray-600 mb-4">
              The materials appearing on Singapore Property Hub could include technical, typographical, or photographic errors. Singapore Property Hub does not warrant that any of the materials on its website are accurate, complete, or current. Singapore Property Hub may make changes to the materials contained on its website at any time without notice.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Modifications</h2>
            <p className="text-gray-600 mb-4">
              Singapore Property Hub may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of Singapore and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              Your use of our website is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
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