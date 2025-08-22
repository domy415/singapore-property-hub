import { marked } from 'marked'

// Configure marked options for better formatting
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // Use GitHub Flavored Markdown
})

export function markdownToHtml(markdown: string): string {
  // Pre-process markdown to ensure proper spacing
  let processedMarkdown = markdown
    // Ensure double line breaks between paragraphs
    .replace(/\n(?!\n)/g, '\n\n')
    // Add spacing after headers
    .replace(/^(#{1,6}\s+.+)$/gm, '$1\n')
    // Ensure lists have proper spacing
    .replace(/^(\s*[-*+]\s+.+)$/gm, '\n$1')
    // Add spacing before and after code blocks
    .replace(/```/g, '\n```\n')
  
  // Parse markdown to HTML
  let html = marked.parse(processedMarkdown) as string
  
  // Post-process HTML for better formatting
  html = html
    // Ensure paragraphs have proper spacing
    .replace(/<p>/g, '<p class="mb-4">')
    // Add spacing to lists
    .replace(/<ul>/g, '<ul class="mb-4 space-y-2">')
    .replace(/<ol>/g, '<ol class="mb-4 space-y-2">')
    // Style blockquotes
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-500 pl-4 italic my-4">')
    // Add infographic placeholders
    .replace(/\[INFOGRAPHIC:([^\]]+)\]/g, '<div class="my-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg text-center"><div class="text-2xl mb-2">📊</div><p class="text-gray-700 font-medium">Infographic: $1</p><p class="text-sm text-gray-500 mt-2">Visual content will be displayed here</p></div>')
  
  return html
}