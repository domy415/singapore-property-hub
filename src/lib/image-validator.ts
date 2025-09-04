/**
 * Singapore Property Image Finder Agent - Validation System
 * Ensures all images comply with Singapore-specific guidelines
 */

export interface ImageValidationResult {
  isValid: boolean
  imageType: string
  confidence: 'high' | 'medium' | 'low'
  issues: string[]
}

// Singapore-specific image patterns with their contexts
export const SINGAPORE_IMAGE_PATTERNS = {
  // HDB and Public Housing
  'photo-1648365300669': 'HDB Community Spaces',
  'photo-zIp4YexPPhQ': 'Toa Payoh HDB Blocks with Void Decks',
  
  // Districts
  'photo-1560036486-def2e0dbebb7': 'Toa Payoh District 12',
  'photo-1567620832903': 'CBD Financial District',
  
  // National Day and Celebrations
  'photo-1631086459917': 'Singapore Flag Celebrations',
  'photo-1533628635777': 'Marina Bay Sands National Day',
  
  // Government and Policy
  'photo-1575089976121': 'Singapore Government Buildings',
  
  // New Developments
  'photo-1564013799919': 'Modern Singapore Developments',
  'photo-kNzqXxlvmE4': 'New Launch Developments',
  
  // Weekend Properties and Market Insights
  'photo-1508964942454': 'Weekend Properties Singapore',
  'photo-1567360425618': 'Singapore CBD Skyline Market Analysis',
  
  // Default Singapore Property
  'photo-1567360425618-1594206637d2': 'Singapore CBD Skyline'
} as const

export function validateSingaporeImage(imageUrl: string, articleTitle: string): ImageValidationResult {
  const result: ImageValidationResult = {
    isValid: false,
    imageType: 'Unknown',
    confidence: 'low',
    issues: []
  }

  if (!imageUrl) {
    result.issues.push('No image URL provided')
    return result
  }

  // Check if image is from approved Singapore patterns
  const matchedPattern = Object.entries(SINGAPORE_IMAGE_PATTERNS).find(([pattern]) => 
    imageUrl.includes(pattern)
  )

  if (matchedPattern) {
    result.isValid = true
    result.imageType = matchedPattern[1]
    result.confidence = 'high'
  } else {
    result.issues.push('Image does not match Singapore Property Image Finder Agent guidelines')
    
    // Check for generic Unsplash patterns that should be replaced
    if (imageUrl.includes('unsplash.com')) {
      const photoId = imageUrl.match(/photo-([a-zA-Z0-9_-]+)/)?.[0]
      if (photoId && !Object.keys(SINGAPORE_IMAGE_PATTERNS).includes(photoId)) {
        result.issues.push(`Generic Unsplash image detected: ${photoId}`)
      }
    }
  }

  // Content-specific validation
  const title = articleTitle.toLowerCase()
  
  if (matchedPattern) {
    // Validate content-image alignment
    const [pattern, imageType] = matchedPattern
    
    if (title.includes('hdb') || title.includes('private property')) {
      if (!imageType.includes('HDB')) {
        result.issues.push('HDB article should use HDB-specific imagery')
        result.confidence = 'medium'
      }
    }
    
    if (title.includes('district 12') || title.includes('toa payoh')) {
      if (!imageType.includes('Toa Payoh')) {
        result.issues.push('District 12 article should use Toa Payoh imagery')
        result.confidence = 'medium'
      }
    }
    
    if (title.includes('national day') || title.includes('celebrating')) {
      if (!imageType.includes('Flag') && !imageType.includes('National Day')) {
        result.issues.push('National Day article should use celebration imagery')
        result.confidence = 'medium'
      }
    }
  }

  return result
}

export function suggestCorrectImage(articleTitle: string): string {
  const title = articleTitle.toLowerCase()
  
  // HDB vs Private Property articles
  if (title.includes('hdb') || title.includes('private property')) {
    return 'https://images.unsplash.com/photo-1648365300669-e7b760c6d240?w=1200&h=630&q=80'
  }
  
  // District-specific articles
  if (title.includes('district 12') || title.includes('toa payoh') || title.includes('balestier')) {
    return 'https://images.unsplash.com/photo-1560036486-def2e0dbebb7?w=1200&h=630&q=80'
  }
  
  if (title.includes('district 2') || title.includes('anson') || title.includes('tanjong pagar')) {
    return 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1200&h=630&q=80'
  }
  
  // National Day articles
  if (title.includes('national day') || title.includes('celebrating') || title.includes('independence')) {
    return 'https://images.unsplash.com/photo-1631086459917-a18a7dbb1699?w=1200&h=630&q=80'
  }
  
  // Weekend property articles
  if (title.includes('weekend') || title.includes('property picks')) {
    return 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&h=630&q=80'
  }
  
  // New launch articles
  if (title.includes('new launch') || title.includes('bloomsbury') || title.includes('residences')) {
    return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&q=80'
  }
  
  // Government policy articles
  if (title.includes('cooling measures') || title.includes('policy') || title.includes('government')) {
    return 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=1200&h=630&q=80'
  }
  
  // Default Singapore CBD skyline for market insights
  return 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=1200&h=630&q=80'
}

export function getImageComplianceReport(articles: Array<{id: string, title: string, featuredImage: string | null}>) {
  const report = {
    total: articles.length,
    compliant: 0,
    nonCompliant: 0,
    issues: [] as Array<{
      articleId: string
      title: string
      currentImage: string | null
      issues: string[]
      suggestedImage: string
    }>
  }

  articles.forEach(article => {
    if (!article.featuredImage) {
      report.nonCompliant++
      report.issues.push({
        articleId: article.id,
        title: article.title,
        currentImage: null,
        issues: ['Missing featured image'],
        suggestedImage: suggestCorrectImage(article.title)
      })
      return
    }

    const validation = validateSingaporeImage(article.featuredImage, article.title)
    
    if (validation.isValid && validation.issues.length === 0) {
      report.compliant++
    } else {
      report.nonCompliant++
      report.issues.push({
        articleId: article.id,
        title: article.title,
        currentImage: article.featuredImage,
        issues: validation.issues,
        suggestedImage: suggestCorrectImage(article.title)
      })
    }
  })

  return report
}