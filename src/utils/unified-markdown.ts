import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize from 'rehype-sanitize'

/**
 * Professional markdown to HTML converter using Unified ecosystem
 * Ensures proper heading separation and semantic HTML structure
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  try {
    // EMERGENCY Pre-processing to fix ALL formatting issues
    let processedMarkdown = markdown
      
      // 0. Fix the specific "Expert###" pattern first
      .replace(/Expert###\s*Market Context/g, 'Expert\n\n### Market Context')
      .replace(/Expert###([^#\n]+)/g, 'Expert\n\n###$1')
      
      // 1. Fix headers without space after # symbols
      .replace(/^(#{1,6})([^#\s\n])/gm, '$1 $2')
      
      // 2. CRITICAL FIX: Headers merged with following text - COMPREHENSIVE
      .replace(/^(#{1,6}\s*)([^#\n]*?)([A-Z][a-z][^\n]*)/gm, (match, hashSymbols, headerPart, textPart) => {
        // Skip if already properly formatted
        if (match.includes('\n\n') || headerPart.trim().length === 0) {
          return match;
        }
        
        const fullText = headerPart + textPart;
        const words = fullText.trim().split(/\s+/);
        
        // If very short, probably not merged
        if (words.length <= 2) {
          return match;
        }
        
        // Look for natural break points
        for (let i = 2; i <= Math.min(8, words.length - 2); i++) {
          const potentialHeader = words.slice(0, i).join(' ');
          const remainingText = words.slice(i).join(' ');
          
          const nextWord = words[i];
          if (nextWord && 
              /^[A-Z]/.test(nextWord) && 
              remainingText.length > 15 &&
              !potentialHeader.match(/\b(the|and|or|but|in|on|at|to|for|with|by)$/i) &&
              !['And', 'But', 'Or', 'The', 'In', 'On', 'At', 'To', 'For', 'With', 'By', 'Of'].includes(nextWord)) {
            return `${hashSymbols}${potentialHeader}\n\n${remainingText}`;
          }
        }
        
        // Fallback split
        if (words.length > 6) {
          const headerWords = words.slice(0, 4);
          const textWords = words.slice(4);
          return `${hashSymbols}${headerWords.join(' ')}\n\n${textWords.join(' ')}`;
        }
        
        return match;
      })
      
      // 3. Fix sentences that run together
      .replace(/([.!?])([A-Z][a-z]{3,}[^.!?\n]{10,})/g, '$1 $2')
      
      // 4. Fix common merged patterns
      .replace(/Market DynamicsThe/g, 'Market Dynamics\n\nThe')
      .replace(/Central Region \(CCR\)where/g, 'Central Region (CCR)\n\nwhere')
      .replace(/Core Central Region \(CCR\)where/g, 'Core Central Region (CCR)\n\nwhere')
      
      // 5. Fix word boundaries that got merged
      .replace(/([a-z])([A-Z][a-z]+(?:\s+[a-z]+){2,})/g, (match, lastChar, capitalizedText) => {
        if (capitalizedText.length > 15 && 
            /^[A-Z][a-z]+\s+[a-z]+\s+[a-z]+/.test(capitalizedText) &&
            !capitalizedText.match(/^(The|A|An|In|On|Of|To|For|With|By|And|But|Or)\s/)) {
          return `${lastChar}\n\n${capitalizedText}`;
        }
        return `${lastChar} ${capitalizedText}`;
      })
      
      // 6. Ensure proper spacing after ALL headings
      .replace(/^(#{1,6}\s+[^\n]+?)(\n)([^\n#])/gm, '$1\n\n$3')
      
      // 7. Clean up multiple newlines
      .replace(/\n{4,}/g, '\n\n\n')
      
      // 8. Fix double spaces
      .replace(/  +/g, ' ')
      
      // 9. Trim lines and remove trailing spaces
      .split('\n').map(line => line.trimEnd()).join('\n')
      .trim()
      
    const result = await unified()
      .use(remarkParse) // Parse markdown to AST
      .use(remarkRehype, { 
        allowDangerousHtml: false // Security: don't allow raw HTML
      }) // Convert to HTML AST
      .use(rehypeSanitize) // Sanitize to prevent XSS
      .use(rehypeStringify) // Convert to HTML string
      .process(processedMarkdown)

    let html = String(result)
    
    // Post-process HTML for better styling and accessibility
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

    return html

  } catch (error) {
    console.error('Error processing markdown:', error)
    // Fallback: return sanitized version of original markdown
    return markdown.replace(/[<>&"']/g, (match) => {
      const htmlEscapes: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;'
      }
      return htmlEscapes[match]
    })
  }
}

/**
 * Extract reading time from markdown content
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

/**
 * Extract excerpt from markdown content
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/\*\*/g, '') // Remove bold syntax
    .replace(/\n+/g, ' ') // Replace newlines with spaces
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
}