import { ArticleCategory } from '@prisma/client'

// Comprehensive collection of Singapore property images from Unsplash
const PROPERTY_IMAGES = {
  [ArticleCategory.MARKET_INSIGHTS]: [
    // Singapore skylines and cityscapes
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565618506-c9ef1c10e35e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600664356348-10686526af36?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.BUYING_GUIDE]: [
    // Home interiors, keys, contracts
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558036117-15d82a90b9e0?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.INVESTMENT]: [
    // Financial charts, money, investment concepts
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.NEIGHBORHOOD]: [
    // Singapore neighborhoods and streets
    'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547919307-1ecb10702e6f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542370285-b8eb8317691c?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.PROPERTY_NEWS]: [
    // News, documents, announcements
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.SELLING_GUIDE]: [
    // For sale signs, handshakes, property viewings
    'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593672715438-d88a70629abe?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571079977755-4083a66e09d0?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.NEW_LAUNCH_REVIEW]: [
    // Modern condos and new developments
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555636222-cae831534b7b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop&q=80',
  ],
  [ArticleCategory.LOCATION_GUIDE]: [
    // Singapore landmarks and districts
    'https://images.unsplash.com/photo-1519897831810-a9a01aceccd1?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609924211018-5526c55bad5b?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547030872-e66986265f2a?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527066579998-dbbae57b9ca2?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=1200&h=630&fit=crop&q=80',
    'https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=1200&h=630&fit=crop&q=80',
  ]
}

export class ImageSelector {
  
  static async getUniqueImage(category: ArticleCategory): Promise<string> {
    // Get available images for this category
    const categoryImages = PROPERTY_IMAGES[category] || PROPERTY_IMAGES[ArticleCategory.MARKET_INSIGHTS]
    
    // Get recently used images from database
    const recentImages = await this.getRecentlyUsedImages()
    
    // Filter out recently used images
    const availableImages = categoryImages.filter(img => !recentImages.includes(img))
    
    // If all images have been used, select from full pool
    const imagesToSelect = availableImages.length > 0 ? availableImages : categoryImages
    
    // Random selection
    const selectedImage = imagesToSelect[Math.floor(Math.random() * imagesToSelect.length)]
    
    return selectedImage
  }

  private static async getRecentlyUsedImages(): Promise<string[]> {
    try {
      // Skip database check during build
      if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
        return []
      }
      
      // Import prisma only when needed to avoid build issues
      const { prisma } = await import('@/lib/prisma')
      
      // Get last 15 article images
      const recentArticles = await prisma.article.findMany({
        select: { featuredImage: true },
        orderBy: { createdAt: 'desc' },
        take: 15
      })
      
      return recentArticles.map(article => article.featuredImage).filter((image): image is string => Boolean(image))
    } catch (error) {
      console.warn('Could not fetch recent images from database:', error)
      return []
    }
  }

  // For getting images based on specific topics
  static async getTopicBasedImage(topic: string, category: ArticleCategory): Promise<string> {
    // Keywords to image mapping for better relevance
    const topicKeywords: { [key: string]: string[] } = {
      'cny': ['chinese', 'festival', 'red', 'celebration'],
      'national day': ['singapore', 'flag', 'skyline', 'celebration'],
      'school': ['education', 'family', 'children', 'neighborhood'],
      'investment': ['finance', 'money', 'chart', 'analysis'],
      'hdb': ['public', 'housing', 'flat', 'singapore'],
      'condo': ['luxury', 'modern', 'condominium', 'facilities'],
      'cooling': ['policy', 'government', 'regulation', 'document'],
      'market': ['trend', 'analysis', 'cityscape', 'business'],
    }

    // Check if topic matches any keyword set
    const lowerTopic = topic.toLowerCase()
    for (const [keyword, relatedTerms] of Object.entries(topicKeywords)) {
      if (lowerTopic.includes(keyword) || relatedTerms.some(term => lowerTopic.includes(term))) {
        // Try to find a more specific image category
        if (keyword === 'investment') return this.getUniqueImage(ArticleCategory.INVESTMENT)
        if (keyword === 'school') return this.getUniqueImage(ArticleCategory.NEIGHBORHOOD)
        if (keyword === 'cooling') return this.getUniqueImage(ArticleCategory.PROPERTY_NEWS)
      }
    }

    // Default to category-based selection
    return this.getUniqueImage(category)
  }
}