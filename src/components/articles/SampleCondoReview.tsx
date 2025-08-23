import CondoReviewTemplate from './CondoReviewTemplate'

const sampleCondoData = {
  name: 'The Continuum',
  slug: 'the-continuum',
  heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=600&fit=crop',
  rating: 4.5,
  quickFacts: {
    yearBuilt: '2016',
    totalUnits: '816',
    developer: 'Hoi Hup Realty & Sunway Development',
    mrtDistance: '280m to Tanjong Rhu MRT'
  },
  overview: 'The Continuum stands as one of Singapore\'s most prestigious freehold developments, offering unparalleled luxury living along the Marina Bay waterfront. This iconic twin-tower development boasts breathtaking city and sea views, world-class amenities, and an enviable location that perfectly balances urban convenience with tranquil waterfront living.',
  pros: [
    'Freehold tenure with prime waterfront location',
    'Stunning unobstructed Marina Bay and city skyline views',
    'World-class facilities including 50m lap pool and private marina',
    'Walking distance to Marina Bay Financial District',
    'Prestigious address with strong rental demand',
    'Excellent capital appreciation potential'
  ],
  cons: [
    'Premium pricing may limit buyer pool',
    'High maintenance fees due to extensive facilities',
    'Limited nearby hawker centers and local amenities',
    'Traffic congestion during peak hours',
    'Competition from newer luxury developments'
  ],
  facilities: [
    '50-meter Infinity Pool',
    'Private Marina & Yacht Club',
    'Gymnasium & Fitness Studio',
    'Tennis Court',
    'BBQ Pavilions',
    'Children\'s Playground',
    'Function Room',
    '24/7 Concierge Service',
    'Steam Room & Sauna',
    'Jacuzzi',
    'Landscaped Gardens',
    'Car Wash Bay'
  ],
  location: {
    description: 'The Continuum enjoys a coveted waterfront location along Tanjong Rhu Road, offering residents the unique privilege of marina living within the city. The development is strategically positioned between the bustling Marina Bay area and the charming Katong district, providing easy access to both business and leisure destinations.',
    connectivity: [
      'Tanjong Rhu MRT Station - 280m walk',
      'Marina Bay MRT Interchange - 5 minutes drive',
      'Paya Lebar MRT Hub - 8 minutes drive',
      'Changi Airport - 20 minutes drive',
      'Multiple bus services along Tanjong Rhu Road',
      'Easy access to ECP and PIE expressways'
    ],
    amenities: [
      'Marina Bay Sands - 5 minutes drive',
      'Gardens by the Bay - 6 minutes drive',
      'Katong/Joo Chiat heritage district - 10 minutes walk',
      'Marina Square Shopping Mall - 8 minutes drive',
      'Singapore Sports Club - 5 minutes walk',
      'Tanjong Katong Complex - 12 minutes walk'
    ]
  },
  investment: {
    rentalYield: '2.8%',
    capitalAppreciation: 'Strong',
    targetBuyers: [
      'Affluent Professionals',
      'Expatriate Executives',
      'Luxury Investors',
      'Empty Nesters',
      'Marina Enthusiasts'
    ],
    marketOutlook: 'The Continuum benefits from its unique waterfront location and freehold status, making it a resilient investment choice. With limited similar developments in the pipeline and strong rental demand from expatriates and high-net-worth individuals, the outlook remains positive despite market cooling measures.'
  },
  faqs: [
    {
      question: 'What makes The Continuum special compared to other luxury condos?',
      answer: 'The Continuum is unique for its freehold waterfront location, private marina facilities, and unobstructed views of Marina Bay. Unlike many other luxury developments, it offers direct water access and marina berths for residents, creating a truly exclusive lifestyle experience.'
    },
    {
      question: 'Are there any restrictions on foreign ownership?',
      answer: 'As a freehold development, The Continuum can be purchased by foreigners without additional buyer\'s stamp duty (ABSD) exemptions. However, foreign buyers are still subject to the prevailing ABSD rates for residential properties.'
    },
    {
      question: 'What are the typical maintenance fees?',
      answer: 'Maintenance fees typically range from $0.65 to $0.85 per square foot, depending on the unit size and facilities used. The higher fees reflect the extensive amenities including the marina facilities and premium finishes throughout the development.'
    },
    {
      question: 'Is The Continuum suitable for rental investment?',
      answer: 'Yes, The Continuum enjoys strong rental demand, particularly from expatriate executives and high-income professionals. The unique waterfront location and luxury amenities command premium rental rates, though yields are typically lower due to the higher purchase prices.'
    },
    {
      question: 'What are the nearby schools for families?',
      answer: 'Nearby schools include Tao Nan School (within 1km), CHIJ Katong Primary, and Tanjong Katong Secondary School. The area also has good access to international schools such as Canadian International School and Chatsworth International School.'
    }
  ],
  relatedArticles: [
    {
      id: '1',
      title: 'Marina Bay Luxury Condos: Investment Guide 2025',
      excerpt: 'Comprehensive analysis of luxury waterfront developments in Marina Bay area and their investment potential.',
      slug: 'marina-bay-luxury-condos-investment-guide',
      category: 'Investment Guide',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      publishedAt: new Date('2025-01-15')
    },
    {
      id: '2',
      title: 'Freehold vs Leasehold: Which is Better?',
      excerpt: 'Understanding the differences between freehold and leasehold properties and their impact on investment returns.',
      slug: 'freehold-vs-leasehold-singapore-properties',
      category: 'Market Analysis',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
      publishedAt: new Date('2025-01-12')
    },
    {
      id: '3',
      title: 'Katong District Guide: Best Areas to Invest',
      excerpt: 'Detailed analysis of Katong and East Coast districts, including upcoming developments and investment opportunities.',
      slug: 'katong-district-property-investment-guide',
      category: 'Location Guide',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&h=400&fit=crop',
      publishedAt: new Date('2025-01-10')
    }
  ]
}

export default function SampleCondoReview() {
  return <CondoReviewTemplate data={sampleCondoData} />
}