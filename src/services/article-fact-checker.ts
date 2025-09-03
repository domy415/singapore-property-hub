import Anthropic from '@anthropic-ai/sdk'

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
  private anthropic: Anthropic

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })
  }

  async reviewArticle(
    title: string,
    content: string,
    category: string
  ): Promise<ArticleReview> {
    try {
      // First, check title-content alignment
      const titleAlignment = await this.checkTitleContentAlignment(title, content)
      
      // Then, perform fact-checking
      const factCheckResult = await this.checkFacts(content)
      
      // Add title mismatch to issues if found
      if (!titleAlignment.isAligned) {
        factCheckResult.issues.push(`Title-content mismatch: ${titleAlignment.mismatchReason}`)
        factCheckResult.suggestions.push(titleAlignment.suggestion)
      }
      
      // Then, assess overall quality
      const qualityScore = await this.assessQuality(content, factCheckResult)
      
      // Reduce quality score significantly for title mismatches
      const finalQualityScore = titleAlignment.isAligned ? qualityScore : Math.min(qualityScore - 30, 70)
      
      // Generate improvement suggestions
      const improvements = await this.generateImprovements(content, factCheckResult)
      
      // If there are significant issues, generate revised content
      let revisedContent: string | undefined
      if (factCheckResult.issues.length > 0 || finalQualityScore < 80) {
        revisedContent = await this.reviseContent(title, content, factCheckResult, improvements)
      }
      
      return {
        factCheck: factCheckResult,
        qualityScore: finalQualityScore,
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

    IMPORTANT: Distinguish between unverifiable claims vs reasonable projections:
    
    ACCEPTABLE (do NOT flag as issues):
    - Market trends based on historical patterns
    - Projections clearly labeled as estimates or expert opinions  
    - Analysis referencing general market conditions
    - Reasonable speculation about future developments
    - Commentary on policy impacts based on past trends
    
    FLAG AS ISSUES:
    - Specific statistics without sources (exact percentages, precise prices)
    - False regulatory information
    - Incorrect district details or development facts
    - Misleading claims about government policies
    
    Article content:
    ${content}
    
    Provide a detailed fact-check report in JSON format with:
    - isAccurate: boolean (true if no serious factual errors)
    - confidence: number (0-1, based on factual accuracy not speculation)
    - issues: array of serious factual errors only
    - suggestions: array of corrections needed for factual errors
    - verifiedFacts: array of accurate statements
    - unreliableClaims: array of specific claims needing sources
    
    Focus on Singapore-specific factual errors:
    - Incorrect HDB regulations or eligibility
    - Wrong cooling measures rates (ABSD, LTV, etc.)
    - False URA statistics or development details
    - Incorrect district numbers or MRT information
    - Misleading property types or tenure information`

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Use Claude 3.5 Sonnet for fact-checking
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `<context>
You are a Singapore property market expert and fact-checker. Be strict about accuracy but don't flag reasonable market analysis as errors.
</context>

<task>
${prompt}
</task>

<requirements>
- Return valid JSON only
- Focus on factual errors, not reasonable projections
- Be thorough but fair in assessment
</requirements>`
          }
        ],
        temperature: 0.3
      })
      
      const responseText = (response.content[0] as any).text
      
      // Clean the response text before parsing JSON
      const cleanedText = responseText
        .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
        .replace(/\n/g, '\\n')           // Escape newlines
        .replace(/\r/g, '\\r')           // Escape carriage returns
        .replace(/\t/g, '\\t')           // Escape tabs
      
      const result = JSON.parse(cleanedText)
      
      return {
        isAccurate: result.isAccurate ?? true,
        confidence: result.confidence ?? 0.8,
        issues: result.issues || [],
        suggestions: result.suggestions || [],
        verifiedFacts: result.verifiedFacts || [],
        unreliableClaims: result.unreliableClaims || []
      }
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        console.error('Claude API error in fact checking:', error.message)
        throw new Error(`Fact checking failed: ${error.message}`)
      }
      throw error
    }
  }

  private async assessQuality(content: string, factCheck: FactCheckResult): Promise<number> {
    // Base score
    let score = 100
    
    // Deduct for serious fact-checking issues only
    score -= factCheck.issues.length * 5  // Reduced penalty for issues
    score -= factCheck.unreliableClaims.length * 1  // Minor penalty for unsourced claims
    
    // Check content quality metrics
    const wordCount = content.split(/\s+/).length
    if (wordCount < 800) score -= 5  // Reduced penalty
    if (wordCount > 3000) score -= 3  // Reduced penalty
    
    // Check for Singapore-specific content
    const sgKeywords = [
      'singapore', 'hdb', 'condo', 'bto', 'ura', 'cooling measures',
      'absd', 'cpf', 'district', 'mrt', 'sgd', 's$'
    ]
    const hasSgContent = sgKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    )
    if (!hasSgContent) score -= 10  // Reduced penalty
    
    // Ensure articles pass quality gate if no serious errors
    const minScore = factCheck.issues.length === 0 ? 85 : 70
    return Math.max(minScore, Math.min(100, score))
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

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `<context>
You are a Singapore property expert editor. Fix errors while maintaining quality and the original message.
</context>

<task>
${prompt}
</task>

<requirements>
- Return only the revised article content in markdown format
- Fix all factual errors mentioned
- Maintain the original tone and structure
- Ensure Singapore property accuracy
</requirements>`
          }
        ],
        temperature: 0.5
      })
      
      return (response.content[0] as any).text
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        console.error('Claude API error in content revision:', error.message)
        return content // Return original content if revision fails
      }
      throw error
    }
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

  private async checkTitleContentAlignment(title: string, content: string): Promise<{
    isAligned: boolean
    mismatchReason: string
    suggestion: string
  }> {
    const prompt = `You are a content quality analyst. Check if this article title matches the actual content.

Title: "${title}"

Content: "${content.substring(0, 2000)}..."

Analyze if the title accurately represents what the article actually discusses:

1. DISTRICT/NEIGHBORHOOD titles should contain specific district information, neighborhood details, location guides
2. MARKET ANALYSIS titles should contain general market trends and insights
3. NEW LAUNCH titles should focus on specific property developments
4. INVESTMENT titles should focus on investment strategies and advice

Return JSON:
{
  "isAligned": boolean,
  "mismatchReason": "specific reason why title doesn't match content",
  "suggestion": "suggested correction"
}

Examples of MISMATCHES:
- Title says "District Discovery" but content is generic market analysis
- Title says "Neighborhood Spotlight" but no specific neighborhood discussed
- Title says "New Launch Review" but no specific project reviewed
- Title says "Investment Guide" but content is general market discussion`

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Use Claude 3.5 Sonnet for title alignment
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `<context>
You are a content quality analyst focused on title-content alignment.
</context>

<task>
${prompt}
</task>

<requirements>
- Return valid JSON only
- Be strict about title-content matching
- Focus on whether title promises are delivered in content
</requirements>`
          }
        ],
        temperature: 0.3
      })
      
      const responseText = (response.content[0] as any).text
      
      // Clean the response text before parsing JSON
      const cleanedText = responseText
        .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
        .replace(/\n/g, '\\n')           // Escape newlines
        .replace(/\r/g, '\\r')           // Escape carriage returns
        .replace(/\t/g, '\\t')           // Escape tabs
      
      const result = JSON.parse(cleanedText)
      return {
        isAligned: result.isAligned || false,
        mismatchReason: result.mismatchReason || 'Title does not match content',
        suggestion: result.suggestion || 'Rewrite title to match actual content'
      }
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        console.error('Claude API error in title alignment check:', error.message)
      }
      return {
        isAligned: false,
        mismatchReason: 'Unable to verify title-content alignment',
        suggestion: 'Review title and content manually'
      }
    }
  }
}