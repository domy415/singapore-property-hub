/**
 * Safe Markdown Processing Helper
 * Implements defensive programming for markdown content processing
 * Prevents server-side exceptions with comprehensive error handling
 */

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize from 'rehype-sanitize'

interface SafeMarkdownOptions {
  maxLength?: number
  fallbackContent?: string
  enableLogging?: boolean
}

interface MarkdownProcessingResult {
  success: boolean
  html: string
  error?: string
  warnings: string[]
}

/**
 * Safe markdown to HTML converter with comprehensive error handling
 */
export async function safeMarkdownToHtml(
  markdown: string | null | undefined,
  options: SafeMarkdownOptions = {}
): Promise<MarkdownProcessingResult> {
  const {
    maxLength = 50000,
    fallbackContent = '<p>Content temporarily unavailable. Please try again later.</p>',
    enableLogging = true
  } = options

  const warnings: string[] = []
  
  // Input validation and sanitization
  if (!markdown) {
    if (enableLogging) {
      console.warn('[SafeMarkdown] Empty or null markdown content provided')
    }
    return {
      success: false,
      html: fallbackContent,
      error: 'Empty content',
      warnings: ['Empty or null markdown content']
    }
  }

  // Type safety check
  if (typeof markdown !== 'string') {
    if (enableLogging) {
      console.warn('[SafeMarkdown] Invalid markdown type:', typeof markdown)
    }
    return {
      success: false,
      html: fallbackContent,
      error: 'Invalid content type',
      warnings: [`Invalid content type: ${typeof markdown}`]
    }
  }

  // Length validation
  if (markdown.length > maxLength) {
    warnings.push(`Content length (${markdown.length}) exceeds maximum (${maxLength})`)
    markdown = markdown.substring(0, maxLength) + '...\n\n*Content truncated for display.*'
  }

  // Content quality checks
  if (markdown.trim().length === 0) {
    return {
      success: false,
      html: fallbackContent,
      error: 'Empty trimmed content',
      warnings: ['Content is only whitespace']
    }
  }

  // Check for potentially problematic patterns
  const problematicPatterns = [
    { pattern: /\0/g, name: 'null bytes' },
    { pattern: /[\x00-\x08\x0B\x0C\x0E-\x1F]/g, name: 'control characters' },
    { pattern: /<script[^>]*>/gi, name: 'script tags' },
    { pattern: /javascript:/gi, name: 'javascript protocol' }
  ]

  let cleanedMarkdown = markdown
  for (const { pattern, name } of problematicPatterns) {
    if (pattern.test(cleanedMarkdown)) {
      warnings.push(`Removed ${name} from content`)
      cleanedMarkdown = cleanedMarkdown.replace(pattern, '')
    }
  }

  try {
    // Pre-processing with error recovery
    let processedMarkdown = cleanedMarkdown
    
    try {
      // Apply the same preprocessing from unified-markdown.ts but with error handling
      processedMarkdown = processedMarkdown
        // Fix headers without space after # symbols
        .replace(/^(#{1,6})([^#\s\n])/gm, '$1 $2')
        
        // Fix headers merged with following text
        .replace(/^(#{1,6}\s*)([^#\n]*?)([A-Z][a-z][^\n]*)/gm, (match, hashSymbols, headerPart, textPart) => {
          try {
            // Skip if already properly formatted
            if (match.includes('\n\n') || headerPart.trim().length === 0) {
              return match
            }
            
            const fullText = headerPart + textPart
            const words = fullText.trim().split(/\s+/)
            
            // If very short, probably not merged
            if (words.length <= 2) {
              return match
            }
            
            // Look for natural break points
            for (let i = 2; i <= Math.min(8, words.length - 2); i++) {
              const potentialHeader = words.slice(0, i).join(' ')
              const remainingText = words.slice(i).join(' ')
              
              const nextWord = words[i]
              if (nextWord && 
                  /^[A-Z]/.test(nextWord) && 
                  remainingText.length > 15 &&
                  !potentialHeader.match(/\b(the|and|or|but|in|on|at|to|for|with|by)$/i) &&
                  !['And', 'But', 'Or', 'The', 'In', 'On', 'At', 'To', 'For', 'With', 'By', 'Of'].includes(nextWord)) {
                return `${hashSymbols}${potentialHeader}\n\n${remainingText}`
              }
            }
            
            return match
          } catch (err) {
            warnings.push('Header formatting failed, using original text')
            return match
          }
        })
        
        // Clean up multiple newlines
        .replace(/\n{4,}/g, '\n\n\n')
        
        // Fix double spaces
        .replace(/  +/g, ' ')
        
        // Trim lines and remove trailing spaces
        .split('\n').map(line => line.trimEnd()).join('\n')
        .trim()
        
    } catch (preprocessError) {
      warnings.push('Preprocessing failed, using original content')
      if (enableLogging) {
        console.warn('[SafeMarkdown] Preprocessing error:', preprocessError)
      }
      processedMarkdown = cleanedMarkdown
    }

    // Unified processing with timeout protection
    const processingPromise = unified()
      .use(remarkParse)
      .use(remarkRehype, { 
        allowDangerousHtml: false // Security: don't allow raw HTML
      })
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(processedMarkdown)

    // Add timeout protection for processing
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Markdown processing timeout')), 30000) // 30 second timeout
    })

    const result = await Promise.race([processingPromise, timeoutPromise])
    let html = String(result)
    
    // Post-process HTML with error handling
    try {
      html = html
        // Add semantic classes to headings
        .replace(/<h1>/g, '<h1 class="article-h1">')
        .replace(/<h2>/g, '<h2 class="article-h2">')  
        .replace(/<h3>/g, '<h3 class="article-h3">')
        .replace(/<h4>/g, '<h4 class="article-h4">')
        .replace(/<h5>/g, '<h5 class="article-h5">')
        .replace(/<h6>/g, '<h6 class="article-h6">')
        
        // Add classes to paragraphs for consistent styling
        .replace(/<p>/g, '<p class="article-paragraph">')
        
        // Add classes to lists
        .replace(/<ul>/g, '<ul class="article-list">')
        .replace(/<ol>/g, '<ol class="article-list">')
        .replace(/<li>/g, '<li class="article-list-item">')
        
        // Style blockquotes
        .replace(/<blockquote>/g, '<blockquote class="article-blockquote">')
        
        // Add classes for better code styling
        .replace(/<code>/g, '<code class="article-code">')
        .replace(/<pre>/g, '<pre class="article-pre">')
        
        // Clean up any empty paragraphs
        .replace(/<p class="article-paragraph">\s*<\/p>/g, '')

    } catch (postProcessError) {
      warnings.push('HTML post-processing failed')
      if (enableLogging) {
        console.warn('[SafeMarkdown] Post-processing error:', postProcessError)
      }
      // Use unprocessed HTML if post-processing fails
    }

    // Final validation
    if (!html || html.trim().length === 0) {
      if (enableLogging) {
        console.warn('[SafeMarkdown] Processing resulted in empty HTML')
      }
      return {
        success: false,
        html: fallbackContent,
        error: 'Empty HTML output',
        warnings: [...warnings, 'Processing resulted in empty HTML']
      }
    }

    // Success logging
    if (enableLogging && warnings.length > 0) {
      console.log(`[SafeMarkdown] Processed successfully with ${warnings.length} warnings:`, warnings)
    }

    return {
      success: true,
      html,
      warnings
    }

  } catch (error) {
    // Comprehensive error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (enableLogging) {
      console.error('[SafeMarkdown] Processing failed:', {
        error: errorMessage,
        contentLength: markdown?.length || 0,
        warnings
      })
    }

    // HTML escape fallback content for security
    const escapedFallback = markdown
      .replace(/[<>&"']/g, (match) => {
        const htmlEscapes: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#39;'
        }
        return htmlEscapes[match] || match
      })
      // Limit escaped content length
      .substring(0, 1000)

    return {
      success: false,
      html: `<div class="error-fallback"><p>Content processing error. Raw content preview:</p><pre>${escapedFallback}</pre></div>`,
      error: errorMessage,
      warnings: [...warnings, `Processing failed: ${errorMessage}`]
    }
  }
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string | null | undefined): string {
  if (!content || typeof content !== 'string') {
    return '1 min read'
  }
  
  try {
    const wordsPerMinute = 200
    const wordCount = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .split(/\\s+/)
      .filter(word => word.length > 0).length
    
    const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
    return `${readTime} min read`
  } catch {
    return '1 min read'
  }
}

/**
 * Safe excerpt extraction
 */
export function safeExtractExcerpt(content: string | null | undefined, maxLength: number = 160): string {
  if (!content || typeof content !== 'string') {
    return 'Content preview unavailable.'
  }
  
  try {
    const plainText = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/#{1,6}\\s/g, '') // Remove markdown headers
      .replace(/\\*\\*/g, '') // Remove bold syntax
      .replace(/\\n+/g, ' ') // Replace newlines with spaces
      .trim()
      
    if (plainText.length <= maxLength) {
      return plainText
    }
    
    // Find the last complete sentence within the limit
    const excerpt = plainText.substring(0, maxLength)
    const lastSentenceEnd = Math.max(
      excerpt.lastIndexOf('.'),
      excerpt.lastIndexOf('!'),
      excerpt.lastIndexOf('?')
    )
    
    if (lastSentenceEnd > maxLength * 0.5) {
      return excerpt.substring(0, lastSentenceEnd + 1).trim()
    }
    
    // If no sentence end found, cut at last word
    const lastSpace = excerpt.lastIndexOf(' ')
    return lastSpace > 0 ? excerpt.substring(0, lastSpace).trim() + '...' : excerpt + '...'
  } catch {
    return 'Content preview unavailable.'
  }
}