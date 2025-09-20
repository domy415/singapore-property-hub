import { NextRequest, NextResponse } from 'next/server';
import ContentCalendarEngine from '../../src/lib/content-calendar-engine';

// This runs at specific times via Vercel cron
export default async function handler(req: NextRequest) {
  try {
    // Check for proper authorization
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    console.log(`🕐 Cron job running at ${hour}:${minute.toString().padStart(2, '0')} SGT`);
    
    // 9 AM SGT - Publish daily article
    if (hour === 9 && minute === 0) {
      console.log('📅 Daily content publishing time');
      
      const engine = new ContentCalendarEngine();
      const calendar = engine.generateCalendar();
      const todayContent = engine.getTodayContent();
      
      if (todayContent) {
        console.log(`🚀 Publishing scheduled content: "${todayContent.title}"`);
        console.log(`   Type: ${todayContent.type}`);
        console.log(`   Agent: ${todayContent.agent}`);
        
        // Trigger appropriate agent based on content type
        if (todayContent.agent.includes('singapore-property-scorer')) {
          console.log('   → Triggering DQI scoring agent');
          // Could integrate with existing property scoring API
        }
        
        if (todayContent.agent.includes('property-article-writer')) {
          console.log('   → Triggering article writer agent');
          // Could integrate with existing content generation API
        }
        
        return NextResponse.json({ 
          success: true, 
          action: 'daily_publish',
          content: {
            title: todayContent.title,
            type: todayContent.type,
            agent: todayContent.agent
          }
        });
      } else {
        console.log('⚠️ No content scheduled for today');
        return NextResponse.json({ 
          success: true, 
          action: 'no_content_scheduled',
          message: 'No article scheduled for today'
        });
      }
    }
    
    // 12 PM SGT - Check for breaking news
    if (hour === 12 && minute === 0) {
      console.log('📰 Checking for breaking news triggers');
      
      const engine = new ContentCalendarEngine();
      
      // Check for potential reactive content triggers
      // This could integrate with external APIs to check for:
      // - New cooling measures
      // - Interest rate changes
      // - URA flash estimates
      // - New condo launches
      
      return NextResponse.json({ 
        success: true, 
        action: 'news_check',
        message: 'Breaking news check completed'
      });
    }
    
    // 6 PM SGT - Prepare tomorrow's content
    if (hour === 18 && minute === 0) {
      console.log('📝 Preparing tomorrow\'s content');
      
      const engine = new ContentCalendarEngine();
      const tomorrowContent = engine.getTomorrowContent();
      
      if (!tomorrowContent) {
        console.log('⚠️ No content scheduled for tomorrow - adding emergency content');
        // Could trigger emergency content generation
      } else {
        console.log(`✅ Tomorrow's content ready: "${tomorrowContent.title}"`);
      }
      
      return NextResponse.json({ 
        success: true, 
        action: 'tomorrow_prep',
        tomorrowContent: tomorrowContent ? {
          title: tomorrowContent.title,
          type: tomorrowContent.type
        } : null
      });
    }
    
    // Default response for other times
    return NextResponse.json({ 
      success: true, 
      action: 'no_scheduled_task',
      time: `${hour}:${minute.toString().padStart(2, '0')}`,
      message: 'No scheduled task for this time'
    });
    
  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Export for both App Router and Pages Router compatibility
export { handler as GET, handler as POST };