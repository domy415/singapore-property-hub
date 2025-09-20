const fs = require('fs');
const path = require('path');

// Monitoring schedule - only check at specific times
const MONITORING_SCHEDULE = {
  '08:00': 'pre_publish_check',
  '09:00': 'publish_daily',
  '09:15': 'verify_publish',
  '12:00': 'check_news',
  '15:00': 'check_data_sources',
  '18:00': 'prepare_tomorrow',
  '21:00': 'final_check'
};

class ContentMonitor {
  constructor() {
    this.lastCheck = null;
    this.todayPublished = false;
  }
  
  async runScheduledCheck() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const task = MONITORING_SCHEDULE[currentTime];
    if (!task) return; // Not a scheduled time
    
    console.log(`\n📅 CONTENT MONITORING - ${currentTime} SGT`);
    console.log('=' .repeat(50));
    
    switch (task) {
      case 'pre_publish_check':
        await this.prePublishCheck();
        break;
      case 'publish_daily':
        await this.publishDailyContent();
        break;
      case 'verify_publish':
        await this.verifyPublication();
        break;
      case 'check_news':
        await this.checkForBreakingNews();
        break;
      case 'check_data_sources':
        await this.checkDataSources();
        break;
      case 'prepare_tomorrow':
        await this.prepareTomorrowContent();
        break;
      case 'final_check':
        await this.finalDailyCheck();
        break;
    }
  }
  
  async prePublishCheck() {
    console.log('🔍 Pre-publish check...');
    // Verify today's article is ready
    const todayArticle = this.getTodayScheduledArticle();
    if (!todayArticle) {
      console.log('⚠️ No article scheduled for today! Generating...');
      await this.generateEmergencyContent();
    } else {
      console.log(`✅ Today's article ready: "${todayArticle.title}"`);
    }
  }
  
  async publishDailyContent() {
    console.log('🚀 Publishing daily content...');
    const todayArticle = this.getTodayScheduledArticle();
    
    if (!todayArticle) {
      console.log('❌ No article to publish!');
      return;
    }
    
    console.log(`📝 Publishing: "${todayArticle.title}"`);
    console.log(`   Type: ${todayArticle.type}`);
    console.log(`   Agent: ${todayArticle.agent}`);
    
    // Trigger the appropriate agent
    if (todayArticle.agent.includes('singapore-property-scorer')) {
      console.log('   → Triggering DQI scoring first...');
      await this.triggerAgent('property-scorer', todayArticle);
    }
    
    if (todayArticle.agent.includes('property-article-writer')) {
      console.log('   → Triggering article writer...');
      await this.triggerAgent('article-writer', todayArticle);
    }
    
    this.todayPublished = true;
    console.log('✅ Article published successfully!');
    
    // Trigger LinkedIn optimizer
    console.log('   → Triggering LinkedIn optimizer...');
    await this.triggerAgent('linkedin-optimizer', todayArticle);
  }
  
  async verifyPublication() {
    console.log('🔍 Verifying publication...');
    if (!this.todayPublished) {
      console.log('⚠️ Today\'s article not published! Retrying...');
      await this.publishDailyContent();
    } else {
      console.log('✅ Today\'s article confirmed published');
    }
  }
  
  async checkForBreakingNews() {
    console.log('📰 Checking for breaking news...');
    
    const triggers = [];
    
    // Check for cooling measures
    const coolingMeasures = await this.checkCoolingMeasures();
    if (coolingMeasures) triggers.push('New cooling measures announced');
    
    // Check for new launches
    const newLaunches = await this.checkNewLaunches();
    if (newLaunches.length > 0) {
      newLaunches.forEach(launch => triggers.push(`New launch: ${launch}`));
    }
    
    // Check for interest rate changes
    const rateChanges = await this.checkInterestRates();
    if (rateChanges) triggers.push('Interest rate change detected');
    
    // Check for URA flash estimates
    const uraFlash = await this.checkURAFlash();
    if (uraFlash) triggers.push('URA flash estimates released');
    
    if (triggers.length > 0) {
      console.log(`🚨 Found ${triggers.length} breaking news items:`);
      triggers.forEach(t => console.log(`   - ${t}`));
      
      // Generate reactive content for each trigger
      for (const trigger of triggers) {
        await this.generateReactiveContent(trigger);
      }
    } else {
      console.log('✅ No breaking news requiring immediate coverage');
    }
  }
  
  async checkDataSources() {
    console.log('📊 Checking data sources...');
    
    // Check URA for new data
    console.log('   Checking URA website...');
    const uraUpdates = await this.checkURAUpdates();
    
    // Check for new condo launches
    console.log('   Checking for new launches...');
    const newProjects = await this.checkNewProjects();
    
    // Check MAS for interest rates
    console.log('   Checking interest rates...');
    const rateData = await this.checkMASRates();
    
    console.log('✅ Data source check complete');
    
    // Log findings
    if (uraUpdates) console.log(`   → URA: ${uraUpdates}`);
    if (newProjects.length > 0) console.log(`   → New projects: ${newProjects.join(', ')}`);
    if (rateData) console.log(`   → Rate data: ${rateData}`);
  }
  
  async prepareTomorrowContent() {
    console.log('📝 Preparing tomorrow\'s content...');
    
    const tomorrowArticle = this.getTomorrowScheduledArticle();
    if (!tomorrowArticle) {
      console.log('⚠️ No article scheduled for tomorrow! Adding to calendar...');
      await this.addEmergencyTomorrowContent();
    } else {
      console.log(`✅ Tomorrow's article scheduled: "${tomorrowArticle.title}"`);
      
      // Pre-generate if needed
      if (tomorrowArticle.dataSource) {
        console.log(`   Pre-fetching data from: ${tomorrowArticle.dataSource}`);
        await this.prefetchData(tomorrowArticle.dataSource);
      }
    }
  }
  
  async finalDailyCheck() {
    console.log('🌙 Final daily check...');
    
    // Summary of today
    console.log('📊 Today\'s Summary:');
    console.log(`   Published: ${this.todayPublished ? 'Yes' : 'No'}`);
    
    // Check tomorrow is ready
    const tomorrowReady = this.getTomorrowScheduledArticle() !== null;
    console.log(`   Tomorrow ready: ${tomorrowReady ? 'Yes' : 'No'}`);
    
    // Show next 7 days
    console.log('\n📅 Next 7 Days:');
    this.showUpcomingContent(7);
    
    // Reset for tomorrow
    this.todayPublished = false;
  }
  
  getTodayScheduledArticle() {
    // Get today's article from calendar
    // This would connect to your calendar engine
    try {
      const { ContentCalendarEngine } = require('../src/lib/content-calendar-engine.ts');
      const engine = new ContentCalendarEngine();
      const calendar = engine.generateCalendar();
      return engine.getTodayContent();
    } catch (error) {
      console.log('   → Using fallback content selection');
      return {
        title: 'Daily Property Market Update',
        type: 'market_analysis',
        agent: 'property-article-writer'
      };
    }
  }
  
  getTomorrowScheduledArticle() {
    // Get tomorrow's article from calendar
    try {
      const { ContentCalendarEngine } = require('../src/lib/content-calendar-engine.ts');
      const engine = new ContentCalendarEngine();
      return engine.getTomorrowContent();
    } catch (error) {
      return null;
    }
  }
  
  showUpcomingContent(days) {
    // Display upcoming content for specified days
    console.log('   [Calendar integration pending - would show upcoming content]');
    
    // Placeholder upcoming content
    const upcomingTopics = [
      'Condo Review: The Continuum Analysis',
      'District 15 Investment Guide',
      'Monthly Market Pulse Update',
      'HDB vs Condo Comparison Guide',
      'New Launch: Latest Developments',
      'URA Quarterly Review',
      'Property Tax Planning Guide'
    ];
    
    for (let i = 0; i < Math.min(days, upcomingTopics.length); i++) {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      console.log(`   ${date.toLocaleDateString()}: ${upcomingTopics[i]}`);
    }
  }
  
  async generateEmergencyContent() {
    console.log('🚨 Generating emergency content...');
    // Generate fallback content
    console.log('   → Creating daily market update article');
  }
  
  async triggerAgent(agentType, article) {
    // Trigger the appropriate AI agent
    console.log(`   → Agent ${agentType} triggered for: ${article.title}`);
    
    // This would make actual API calls to your agents
    // For now, simulate the action
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`   → Agent ${agentType} completed`);
  }
  
  async generateReactiveContent(trigger) {
    console.log(`   → Generating reactive content for: ${trigger}`);
    // Generate immediate response content
  }
  
  async checkCoolingMeasures() {
    // Check government websites for cooling measure announcements
    return false; // Placeholder
  }
  
  async checkNewLaunches() {
    // Check for new condo launches
    return []; // Placeholder
  }
  
  async checkInterestRates() {
    // Check MAS for rate changes
    return false; // Placeholder
  }
  
  async checkURAFlash() {
    // Check URA for flash estimates
    return false; // Placeholder
  }
  
  async checkURAUpdates() {
    // Check URA for data updates
    return null; // Placeholder
  }
  
  async checkNewProjects() {
    // Check for new project announcements
    return []; // Placeholder
  }
  
  async checkMASRates() {
    // Check MAS for rate data
    return null; // Placeholder
  }
  
  async addEmergencyTomorrowContent() {
    console.log('   → Adding emergency content for tomorrow');
  }
  
  async prefetchData(dataSource) {
    console.log(`   → Prefetching data from ${dataSource}`);
  }
}

// Run the monitor
const monitor = new ContentMonitor();

// If running as a script (not imported), start monitoring
if (require.main === module) {
  console.log('📡 Content Monitor Starting...');
  console.log('Monitoring schedule:');
  Object.entries(MONITORING_SCHEDULE).forEach(([time, task]) => {
    console.log(`   ${time} SGT - ${task.replace(/_/g, ' ')}`);
  });
  console.log('\n⏰ Checking every minute for scheduled tasks...\n');
  
  // Check every minute to see if it's a scheduled time
  setInterval(() => {
    monitor.runScheduledCheck();
  }, 60 * 1000); // Check every minute
  
  // Initial run
  monitor.runScheduledCheck();
}

module.exports = ContentMonitor;