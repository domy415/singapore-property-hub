import { marked } from 'marked'

// Configure marked options for better formatting
marked.setOptions({
  breaks: false, // Don't convert single line breaks to <br>
  gfm: true, // Use GitHub Flavored Markdown
  pedantic: false,
})

export function markdownToHtml(markdown: string): string {
  // CRITICAL: Pre-process markdown to fix all merged heading-text patterns
  let processedMarkdown = markdown
    
  // STEP 1: Remove all bold markdown syntax that shouldn't be there
  processedMarkdown = processedMarkdown.replace(/\*\*/g, '')
  
  // STEP 2: Fix specific known problematic merged patterns first
  const criticalFixes = [
    {
      // Singapore's Property Market title merged with intro
      pattern: /Singapore's Property Market Poised for Continued Growth Amid Evolving Regulatory LandscapeAs we approach/g,
      replacement: "Singapore's Property Market Poised for Continued Growth Amid Evolving Regulatory Landscape\n\nAs we approach"
    },
    {
      // Market Dynamics heading merged
      pattern: /Current Market Dynamics: Resilience Amid Shifting TidesThe Singapore property market/g,
      replacement: "Current Market Dynamics: Resilience Amid Shifting Tides\n\nThe Singapore property market"
    },
    {
      // Policy heading merged 
      pattern: /Policy Impacts and Regulatory LandscapeThe Singapore government's/g,
      replacement: "Policy Impacts and Regulatory Landscape\n\nThe Singapore government's"
    },
    {
      // Segment analysis merged
      pattern: /Segment-Specific Analysis: Resilience Across the BoardThe resilience/g,
      replacement: "Segment-Specific Analysis: Resilience Across the Board\n\nThe resilience"
    },
    {
      // Investment considerations merged
      pattern: /Investment Considerations and Market PositioningAs investors/g,
      replacement: "Investment Considerations and Market Positioning\n\nAs investors"
    },
    {
      // Market outlook merged
      pattern: /Expert Market Outlook and Strategic RecommendationsLooking ahead/g,
      replacement: "Expert Market Outlook and Strategic Recommendations\n\nLooking ahead"
    }
  ]
  
  // Apply all critical fixes
  criticalFixes.forEach(fix => {
    processedMarkdown = processedMarkdown.replace(fix.pattern, fix.replacement)
  })
  
  // STEP 3: Fix general merged patterns
  processedMarkdown = processedMarkdown
    // Fix any remaining merged headings with text (# Title + CapitalLetter)
    .replace(/^(#{1,6}\s+[^\n]+)([A-Z][a-z])/gm, '$1\n\n$2')
    // Fix colon-ended headings merged with text ("Heading:Text")
    .replace(/^(#{1,6}\s+[^:\n]+:)([A-Z])/gm, '$1\n\n$2')
    // Fix sentences ending without space before new sentences (critical for readability)
    .replace(/([.!?])([A-Z][a-z])/g, '$1\n\n$2')
    // Fix merged sections ending with punctuation followed by headers
    .replace(/([.!?\)])\s*(#{1,6}\s)/gm, '$1\n\n$2')
    // Ensure proper spacing after ALL headers
    .replace(/^(#{1,6}\s+.+)$/gm, '$1\n\n')
    // Add breaks between distinct topics/sections for readability
    .replace(/(Singapore|The|In|With|Despite|However|Additionally|Furthermore|Moreover)\s+([A-Z][^.!?]*[.!?])\s*([A-Z])/g, '$1 $2\n\n$3')
    // Fix lists with proper spacing
    .replace(/^(\s*[-*+]\s+.+)$/gm, '\n$1')
    // Add spacing before and after code blocks
    .replace(/```/g, '\n```\n')
    // Clean up excessive newlines (more than 3 in a row) but preserve intentional spacing
    .replace(/\n{4,}/g, '\n\n\n')
  
  // Parse markdown to HTML
  let html = marked.parse(processedMarkdown) as string
  
  // Post-process HTML for better formatting and spacing
  html = html
    // Add proper CSS classes to headings for spacing (CRITICAL: No bold class since headings are bold by default)
    .replace(/<h1>/g, '<h1 class="article-title text-4xl font-bold mb-8 mt-12 pb-4 border-b border-gray-200 text-gray-900">')
    .replace(/<h2>/g, '<h2 class="section-header text-3xl font-semibold mb-6 mt-12 pb-2 border-b border-gray-200 text-gray-800">')
    .replace(/<h3>/g, '<h3 class="subsection-header text-2xl font-semibold mb-4 mt-10 text-gray-800">')
    .replace(/<h4>/g, '<h4 class="text-xl font-semibold mb-3 mt-8 text-gray-800">')
    
    // CRITICAL: Ensure paragraphs are NEVER bold (font-normal is explicit)
    .replace(/<p>/g, '<p class="article-paragraph mb-6 text-lg leading-relaxed font-normal text-gray-700">')
    
    // Style the first paragraph differently but still NOT bold
    .replace(/<p class="article-paragraph mb-6 text-lg leading-relaxed font-normal text-gray-700">([^<]*(?:<[^>]*>[^<]*)*?)<\/p>/, '<p class="intro-paragraph mb-8 text-xl leading-relaxed font-medium text-gray-800">$1</p>')
    
    // Add proper spacing to lists (also NOT bold)
    .replace(/<ul>/g, '<ul class="article-list mb-8 space-y-4 pl-6">')
    .replace(/<ol>/g, '<ol class="article-list mb-8 space-y-4 pl-6">')
    .replace(/<li>/g, '<li class="mb-2 text-lg leading-relaxed font-normal text-gray-700">')
    
    // Style blockquotes with better visual appeal (NOT bold)
    .replace(/<blockquote>/g, '<blockquote class="article-quote border-l-4 border-blue-500 pl-8 py-6 my-10 italic font-normal text-gray-600 bg-blue-50 rounded-r-lg">')
    
    // Add infographic placeholders
    .replace(/\[INFOGRAPHIC:([^\]]+)\]/g, '<div class="infographic-placeholder my-12 p-8 bg-blue-50 border-2 border-blue-200 rounded-lg text-center"><div class="text-4xl mb-4">📊</div><p class="text-gray-700 font-semibold text-xl">Infographic: $1</p><p class="text-sm text-gray-500 mt-3">Visual content will be displayed here</p></div>')
    
    // CRITICAL: Remove any bold styling from content that shouldn't be bold
    .replace(/<strong>/g, '<span class="font-normal">')
    .replace(/<\/strong>/g, '</span>')
    .replace(/<b>/g, '<span class="font-normal">')
    .replace(/<\/b>/g, '</span>')
    
    // Clean up any empty paragraphs
    .replace(/<p class="[^"]*">\s*<\/p>/g, '')
    
    // Ensure proper spacing around sections
    .replace(/(<\/h[1-6]>)\s*(<p)/g, '$1\n$2')
    
    // CRITICAL: Final cleanup - ensure no unintentional bold formatting
    .replace(/font-weight:\s*bold/g, 'font-weight: normal')
    .replace(/font-weight:\s*700/g, 'font-weight: 400')
  
  // Final cleanup - remove excessive whitespace but preserve intentional spacing
  html = html
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim()
  
  return html
}