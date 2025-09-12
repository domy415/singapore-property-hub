import { Metadata } from 'next'

// Simple test article page to debug server-side exceptions
export const metadata: Metadata = {
  title: 'Test Article | Singapore Property Hub',
  description: 'Test article for debugging server-side exceptions'
}

export default function TestArticlePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Test Article Page
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            This is a simplified test article page to help debug the server-side 
            exceptions occurring on the main article pages.
          </p>
          
          <h2>Test Section</h2>
          <p>
            If this page loads successfully, the issue is likely with database 
            operations, markdown processing, or other complex imports in the 
            main article page.
          </p>
        </div>
      </div>
    </div>
  )
}