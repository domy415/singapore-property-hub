import Link from 'next/link'

interface ProjectReview {
  id: string
  slug: string
  projectName: string
  developer: string
  location: string
  priceFrom: string
  rating: number
  featuredImage: string
  excerpt: string
  publishedAt: Date
}

interface LatestProjectReviewsProps {
  reviews: ProjectReview[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-sm font-semibold text-gray-600">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function LatestProjectReviews({ reviews }: LatestProjectReviewsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Latest Project Reviews
            </h2>
            <p className="text-gray-600 text-lg">
              In-depth analysis of Singapore's newest developments
            </p>
          </div>
          <Link 
            href="/new-launches"
            className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
          >
            View All Projects
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <article 
              key={review.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-48">
                <img 
                  src={review.featuredImage} 
                  alt={review.projectName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-800">{review.location}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-3">
                  <StarRating rating={review.rating} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  <Link href={`/projects/${review.slug}`}>
                    {review.projectName}
                  </Link>
                </h3>
                
                <p className="text-gray-600 text-sm mb-3">
                  by {review.developer}
                </p>
                
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {review.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="text-lg font-bold text-blue-600">{review.priceFrom}</p>
                  </div>
                  
                  <Link 
                    href={`/projects/${review.slug}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Read Review
                  </Link>
                </div>
                
                {/* Lead Capture CTA */}
                <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  Get Floor Plans & Price List
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}