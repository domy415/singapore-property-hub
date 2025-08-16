const cron = require('node-cron')
const { ContentGenerator } = require('../dist/services/content-generator')
const { ArticleReviewer } = require('../dist/services/article-reviewer')
const { LinkedInPublisher } = require('../dist/services/linkedin-publisher')

async function runDailyContentGeneration() {
  console.log('Starting daily content generation...')
  
  try {
    // Generate new article
    const generator = new ContentGenerator()
    await generator.generateDailyArticle()
    console.log('Article generated successfully')
    
    // Review articles
    const reviewer = new ArticleReviewer()
    await reviewer.reviewAllPendingArticles()
    console.log('Articles reviewed successfully')
    
    // Publish to LinkedIn
    const publisher = new LinkedInPublisher()
    await publisher.publishAllPendingArticles()
    console.log('Articles published to LinkedIn')
    
  } catch (error) {
    console.error('Error in content generation:', error)
  }
}

// Schedule daily content generation at 9 AM Singapore time
cron.schedule('0 9 * * *', runDailyContentGeneration, {
  timezone: 'Asia/Singapore'
})

// Run immediately if called directly
if (require.main === module) {
  runDailyContentGeneration()
}

console.log('Content generation scheduler started')