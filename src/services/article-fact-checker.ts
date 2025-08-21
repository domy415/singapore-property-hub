import OpenAI from 'openai'

interface FactCheckResult {
  isAccurate: boolean
  confidence: number // 0-1
  issues: string[]
  suggestions: string[]
  verifiedFacts: string[]
  unreliableClaims: string[]
}

interface ArticleReview {
  factCheck: FactCheckResult
  qualityScore: number // 0-100
  improvements: string[]
  revisedContent?: string
}

export class ArticleFactChecker {
  private openai: OpenAI

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured')
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  async reviewArticle(
    title: string,
    content: string,
    category: string
  ): Promise<ArticleReview> {
    try {
      // First, perform fact-checking
      const factCheckResult = await this.checkFacts(content)
      
      // Then, assess overall quality
      const qualityScore = await this.assessQuality(content, factCheckResult)
      
      // Generate improvement suggestions
      const improvements = await this.generateImprovements(content, factCheckResult)
      
      // If there are significant issues, generate revised content
      let revisedContent: string | undefined
      if (factCheckResult.issues.length > 0 || qualityScore < 80) {
        revisedContent = await this.reviseContent(title, content, factCheckResult, improvements)
      }
      
      return {
        factCheck: factCheckResult,
        qualityScore,
        improvements,
        revisedContent
      }
    } catch (error) {
      console.error('Error reviewing article:', error)
      throw error
    }
  }

  private async checkFacts(content: string): Promise<FactCheckResult> {
    const prompt = `You are a fact-checking expert specializing in Singapore real estate. 
    Review this article content and identify:
    1. Claims that need verification
    2. Statistical data that should be checked
    3. Legal/regulatory information accuracy
    4. Market data and trends accuracy
    
    Article content:
    ${content}
    
    Provide a detailed fact-check report in JSON format with:
    - isAccurate: boolean
    - confidence: number (0-1)
    - issues: array of problematic claims
    - suggestions: array of corrections needed
    - verifiedFacts: array of accurate statements
    - unreliableClaims: array of claims that need sources
    
    Focus on Singapore-specific information like:
    - HDB regulations
    - Cooling measures (ABSD, BSD, LTV, etc.)
    - URA statistics
    - Property prices and trends
    - District information
    - Development details`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a Singapore property market expert and fact-checker. Be strict about accuracy.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3 // Lower temperature for more consistent fact-checking
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    
    return {
      isAccurate: result.isAccurate ?? true,
      confidence: result.confidence ?? 0.8,
      issues: result.issues || [],
      suggestions: result.suggestions || [],
      verifiedFacts: result.verifiedFacts || [],
      unreliableClaims: result.unreliableClaims || []
    }
  }

  private async assessQuality(content: string, factCheck: FactCheckResult): Promise<number> {
    // Base score
    let score = 100
    
    // Deduct for fact-checking issues
    score -= factCheck.issues.length * 5
    score -= factCheck.unreliableClaims.length * 3
    
    // Check content quality metrics
    const wordCount = content.split(/\s+/).length
    if (wordCount < 800) score -= 10
    if (wordCount > 3000) score -= 5
    
    // Check for Singapore-specific content
    const sgKeywords = [
      'singapore', 'hdb', 'condo', 'bto', 'ura', 'cooling measures',
      'absd', 'cpf', 'district', 'mrt', 'sgd', 's$'
    ]
    const hasSgContent = sgKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    )
    if (!hasSgContent) score -= 20
    
    // Ensure minimum quality
    return Math.max(0, Math.min(100, score))
  }

  private async generateImprovements(
    content: string, 
    factCheck: FactCheckResult
  ): Promise<string[]> {
    const improvements: string[] = []
    
    // Add fact-check based improvements
    if (factCheck.issues.length > 0) {
      improvements.push('Fix factual inaccuracies: ' + factCheck.issues.join(', '))
    }
    
    if (factCheck.unreliableClaims.length > 0) {
      improvements.push('Add sources for: ' + factCheck.unreliableClaims.join(', '))
    }
    
    // Content structure improvements
    if (!content.includes('##')) {
      improvements.push('Add clear section headers for better structure')
    }
    
    if (!content.match(/\d{4}/)) {
      improvements.push('Include current year (2025) for relevance')
    }
    
    if (!content.toLowerCase().includes('singapore')) {
      improvements.push('Ensure content is specifically about Singapore property market')
    }
    
    // SEO improvements
    if (!content.includes('](') && !content.includes('](')) {
      improvements.push('Add internal links to related articles')
    }
    
    return improvements
  }

  private async reviseContent(
    title: string,
    content: string,
    factCheck: FactCheckResult,
    improvements: string[]
  ): Promise<string> {
    const prompt = `You are a Singapore property market expert and content editor.
    
    Revise this article to fix all issues while maintaining the original message and structure.
    
    Original Title: ${title}
    
    Issues to fix:
    ${factCheck.issues.join('\n')}
    
    Improvements needed:
    ${improvements.join('\n')}
    
    Original content:
    ${content}
    
    Guidelines:
    1. Fix all factual errors
    2. Add current 2025 context
    3. Ensure all Singapore property regulations are accurate
    4. Maintain engaging, professional tone
    5. Keep similar length and structure
    6. Add credible sources where needed
    7. Ensure SEO optimization
    
    Return only the revised article content in markdown format.`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a Singapore property expert editor. Fix errors while maintaining quality.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5
    })

    return response.choices[0].message.content || content
  }

  // Quick validation for critical facts
  async validateCriticalFacts(content: string): Promise<string[]> {
    const warnings: string[] = []
    
    // Check ABSD rates (as of 2025)
    if (content.includes('ABSD')) {
      if (content.includes('17%') && !content.includes('first-time')) {
        warnings.push('ABSD 17% rate should specify it\'s for citizens buying first property')
      }
      if (content.includes('30%') && !content.includes('second')) {
        warnings.push('ABSD 30% rate should specify it\'s for citizens buying second property')
      }
    }
    
    // Check LTV limits
    if (content.includes('LTV') || content.includes('loan-to-value')) {
      if (content.includes('75%') && !content.includes('first')) {
        warnings.push('LTV 75% should specify it\'s for first property loan')
      }
    }
    
    // Check district numbers
    const districtMatches = content.match(/[Dd]istrict\s+(\d+)/g)
    if (districtMatches) {
      districtMatches.forEach(match => {
        const num = parseInt(match.match(/\d+/)?.[0] || '0')
        if (num < 1 || num > 28) {
          warnings.push(`Invalid district number: ${num}. Singapore has districts 1-28.`)
        }
      })
    }
    
    return warnings
  }
}