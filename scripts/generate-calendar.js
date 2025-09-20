// Note: This is a JavaScript test script for the TypeScript calendar engine
// For production, the TypeScript version would be compiled and used

// Simplified JavaScript version for testing
class ContentCalendarEngine {
  constructor() {
    this.calendar = [];
    this.contentRules = {
      recurring: [
        {
          name: 'URA Quarterly Review',
          frequency: 'quarterly',
          months: [1, 4, 7, 10],
          dayOfMonth: 5,
          template: 'Singapore Property Market Q{quarter} {year}: URA Data Analysis',
          type: 'market_analysis',
          agent: 'property-article-writer',
          dataSource: 'URA quarterly statistics'
        },
        {
          name: 'Monthly Market Pulse',
          frequency: 'monthly',
          dayOfMonth: 15,
          template: '{month} {year} Property Market Update: Latest Trends & Analysis',
          type: 'market_analysis',
          agent: 'property-article-writer'
        },
        {
          name: 'Weekly Condo Review',
          frequency: 'weekly',
          dayOfWeek: 3, // Wednesday
          template: 'Condo Review: {condo_name} Investment Analysis',
          type: 'condo_review',
          agent: 'singapore-property-scorer + singapore-property-report-generator',
          requiresData: 'select_condo_for_review'
        },
        {
          name: 'District Analysis Series',
          frequency: 'biweekly',
          dayOfWeek: 5, // Friday
          template: 'District {district} Property Guide: Investment Opportunities {year}',
          type: 'buyer_guide',
          agent: 'property-article-writer',
          rotation: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]
        },
        {
          name: 'HDB Market Update',
          frequency: 'biweekly',
          dayOfWeek: 1, // Monday
          template: 'HDB Resale Market Update: {month} {year} Analysis',
          type: 'market_analysis',
          agent: 'property-article-writer'
        }
      ]
    };
    
    this.dailyBackupTopics = [
      'First-Time Buyer Guide: HDB vs Condo in {year}',
      'Executive Condo Investment Opportunities',
      'Rental Market Analysis: Best Yields in Singapore',
      'Foreign Investment in Singapore Property: Latest Trends',
      'Resale Market Performance: Top Districts',
      'Property Tax Guide for {year}',
      'Renovation Cost Analysis: Budget Planning Tips',
      'School Proximity and Property Values',
      'MRT Development Impact on Property Prices',
      'Green Buildings: The Future of Singapore Property',
      'Senior Living: Property Options for Retirees',
      'Commercial Property Investment Guide',
      'Shophouse Investment Analysis',
      'Property Market Comparison: Singapore vs Regional Markets',
      'Luxury Property Market Trends'
    ];
  }
  
  generateCalendar() {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);
    
    this.calendar = [];
    
    // Generate recurring content
    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      this.contentRules.recurring.forEach(rule => {
        if (this.shouldSchedule(rule, d)) {
          this.calendar.push(this.createContentItem(rule, new Date(d)));
        }
      });
    }
    
    // Ensure at least one article per day at 9 AM
    this.fillGaps();
    
    // Sort by date
    this.calendar.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
    
    return this.calendar;
  }
  
  shouldSchedule(rule, date) {
    switch (rule.frequency) {
      case 'daily':
        return true;
      case 'weekly':
        return date.getDay() === rule.dayOfWeek;
      case 'biweekly':
        return date.getDay() === rule.dayOfWeek && 
               Math.floor(date.getDate() / 7) % 2 === 0;
      case 'monthly':
        return date.getDate() === rule.dayOfMonth;
      case 'quarterly':
        return rule.months.includes(date.getMonth() + 1) && 
               date.getDate() === rule.dayOfMonth;
      default:
        return false;
    }
  }
  
  createContentItem(rule, date) {
    return {
      id: `${rule.name.replace(/\s+/g, '-').toLowerCase()}-${date.toISOString().split('T')[0]}`,
      title: this.generateTitle(rule.template, date),
      type: rule.type,
      category: this.mapTypeToCategory(rule.type),
      scheduledDate: date,
      scheduledTime: '09:00',
      status: 'planned',
      dataSource: rule.dataSource,
      agent: rule.agent,
      priority: rule.priority || 2
    };
  }
  
  generateTitle(template, date) {
    const replacements = {
      '{quarter}': `Q${Math.floor(date.getMonth() / 3) + 1}`,
      '{year}': date.getFullYear().toString(),
      '{month}': date.toLocaleString('default', { month: 'long' }),
      '{district}': (Math.floor(Math.random() * 28) + 1).toString(),
      '{condo_name}': this.selectCondoForReview()
    };
    
    return template.replace(/{[^}]+}/g, match => 
      replacements[match] || match
    );
  }
  
  selectCondoForReview() {
    const condos = [
      'The Continuum',
      'Grand Dunman',
      'Lentor Mansion',
      'Orchard Sophia',
      'Avenue South Residence',
      'Normanton Park'
    ];
    return condos[Math.floor(Math.random() * condos.length)];
  }
  
  mapTypeToCategory(type) {
    const mapping = {
      'market_analysis': 'MARKET_INSIGHTS',
      'condo_review': 'PROPERTY_REVIEWS',
      'news_update': 'PROPERTY_NEWS',
      'buyer_guide': 'BUYING_GUIDE'
    };
    return mapping[type] || 'MARKET_INSIGHTS';
  }
  
  fillGaps() {
    const dates = new Set(this.calendar.map(item => 
      item.scheduledDate.toISOString().split('T')[0]
    ));
    
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (!dates.has(dateStr)) {
        const topic = this.dailyBackupTopics[i % this.dailyBackupTopics.length];
        this.calendar.push({
          id: `daily-${dateStr}`,
          title: this.generateTitle(topic, checkDate),
          type: this.determineType(topic),
          category: this.mapTypeToCategory(this.determineType(topic)),
          scheduledDate: checkDate,
          scheduledTime: '09:00',
          status: 'planned',
          agent: 'property-article-writer',
          priority: 3
        });
      }
    }
  }
  
  determineType(title) {
    if (title.includes('Review') || title.includes('Launch')) return 'condo_review';
    if (title.includes('Guide')) return 'buyer_guide';
    if (title.includes('Breaking') || title.includes('Flash')) return 'news_update';
    return 'market_analysis';
  }
}

// Generate and display the content calendar
async function generateCalendar() {
  try {
    console.log('📅 Generating Content Calendar...\n');
    
    const engine = new ContentCalendarEngine();
    const calendar = engine.generateCalendar();
    
    console.log(`🗓️ Generated calendar with ${calendar.length} content items for next 30 days\n`);
    
    // Group by date for better display
    const calendarByDate = {};
    calendar.forEach(item => {
      const dateStr = item.scheduledDate.toISOString().split('T')[0];
      if (!calendarByDate[dateStr]) {
        calendarByDate[dateStr] = [];
      }
      calendarByDate[dateStr].push(item);
    });
    
    // Display calendar
    const dates = Object.keys(calendarByDate).sort();
    dates.forEach(date => {
      const items = calendarByDate[date];
      console.log(`📅 ${new Date(date).toLocaleDateString('en-SG', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`);
      
      items.forEach(item => {
        const typeEmoji = {
          'market_analysis': '📊',
          'condo_review': '🏢',
          'news_update': '📰',
          'buyer_guide': '📋'
        };
        
        console.log(`   ${typeEmoji[item.type]} ${item.scheduledTime} - ${item.title}`);
        console.log(`     Agent: ${item.agent}`);
        console.log(`     Priority: ${item.priority}/3`);
        if (item.dataSource) {
          console.log(`     Data Source: ${item.dataSource}`);
        }
      });
      console.log('');
    });
    
    // Summary statistics
    const typeStats = {};
    calendar.forEach(item => {
      typeStats[item.type] = (typeStats[item.type] || 0) + 1;
    });
    
    console.log('📊 Content Type Summary:');
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} articles`);
    });
    
    console.log('\n✅ Calendar generation completed!');
    
  } catch (error) {
    console.error('❌ Error generating calendar:', error);
  }
}

// Run if called directly
if (require.main === module) {
  generateCalendar();
}

module.exports = { generateCalendar };