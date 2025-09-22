import Link from 'next/link'

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-x-4">
            <Link 
              href="/articles" 
              className="inline-block bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              Back to Articles
            </Link>
            <Link 
              href="/" 
              className="inline-block bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}