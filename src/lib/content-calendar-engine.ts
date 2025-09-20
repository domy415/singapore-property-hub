interface ContentItem {
  id: string;
  title: string;
  type: 'market_analysis' | 'condo_review' | 'news_update' | 'buyer_guide';
  category: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: 'planned' | 'in_progress' | 'completed';
  dataSource?: string;
  agent: string;
  priority: number;
}

export class ContentCalendarEngine {
  private calendar: ContentItem[] = [];
  
  // Automated content generation rules
  private contentRules = {
    recurring: [
      {
        name: 'URA Quarterly Review',
        frequency: 'quarterly',
        months: [1, 4, 7, 10],
        dayOfMonth: 5,
        template: 'Singapore Property Market Q{quarter} {year}: URA Data Analysis',
        type: 'market_analysis' as const,
        agent: 'property-article-writer',
        dataSource: 'URA quarterly statistics'
      },
      {
        name: 'Monthly Market Pulse',
        frequency: 'monthly',
        dayOfMonth: 15,
        template: '{month} {year} Property Market Update: Latest Trends & Analysis',
        type: 'market_analysis' as const,
        agent: 'property-article-writer'
      },
      {
        name: 'Weekly Condo Review',
        frequency: 'weekly',
        dayOfWeek: 3, // Wednesday
        template: 'Condo Review: {condo_name} Investment Analysis',
        type: 'condo_review' as const,
        agent: 'singapore-property-scorer + singapore-property-report-generator',
        requiresData: 'select_condo_for_review'
      },
      {
        name: 'District Analysis Series',
        frequency: 'biweekly',
        dayOfWeek: 5, // Friday
        template: 'District {district} Property Guide: Investment Opportunities {year}',
        type: 'buyer_guide' as const,
        agent: 'property-article-writer',
        rotation: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]
      },
      {
        name: 'HDB Market Update',
        frequency: 'biweekly',
        dayOfWeek: 1, // Monday
        template: 'HDB Resale Market Update: {month} {year} Analysis',
        type: 'market_analysis' as const,
        agent: 'property-article-writer'
      }
    ],
    
    reactive: [
      {
        trigger: 'cooling_measures_announcement',
        template: 'Breaking: New Cooling Measures Impact on Property Market',
        type: 'news_update' as const,
        priority: 1,
        agent: 'property-article-writer'
      },
      {
        trigger: 'new_condo_launch',
        template: '{condo_name} Launch: First Look & Investment Analysis',
        type: 'condo_review' as const,
        priority: 1,
        agent: 'singapore-property-scorer + singapore-property-report-generator'
      },
      {
        trigger: 'interest_rate_change',
        template: 'Interest Rate {direction}: Impact on Property Buyers',
        type: 'market_analysis' as const,
        priority: 1,
        agent: 'property-article-writer'
      },
      {
        trigger: 'ura_flash_estimates',
        template: 'URA Flash Estimates: Q{quarter} {year} Property Price Movement',
        type: 'news_update' as const,
        priority: 1,
        agent: 'property-article-writer'
      }
    ]
  };
  
  // Daily backup topics to ensure content every day
  private dailyBackupTopics = [
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
  
  // Generate content calendar for next 30 days
  generateCalendar(): ContentItem[] {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);
    
    this.calendar = [];
    
    // Generate recurring content
    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      this.contentRules.recurring.forEach(rule => {
        if (this.shouldSchedule(rule, d)) {
          this.calendar.push(this.createContentItem(rule, d));
        }
      });
    }
    
    // Ensure at least one article per day at 9 AM
    this.fillGaps();
    
    // Sort by date
    this.calendar.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
    
    return this.calendar;
  }
  
  private shouldSchedule(rule: any, date: Date): boolean {
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
  
  private fillGaps(): void {
    const dates = new Set(this.calendar.map(item => 
      item.scheduledDate.toISOString().split('T')[0]
    ));
    
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (!dates.has(dateStr)) {
        // Add a backup topic for this day
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
  
  private determineType(title: string): ContentItem['type'] {
    if (title.includes('Review') || title.includes('Launch')) return 'condo_review';
    if (title.includes('Guide')) return 'buyer_guide';
    if (title.includes('Breaking') || title.includes('Flash')) return 'news_update';
    return 'market_analysis';
  }
  
  private createContentItem(rule: any, date: Date): ContentItem {
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
  
  private generateTitle(template: string, date: Date): string {
    const replacements: Record<string, string> = {
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
  
  private selectCondoForReview(): string {
    // Rotate through existing condos or check for new launches
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
  
  private mapTypeToCategory(type: ContentItem['type']): string {
    const mapping: Record<ContentItem['type'], string> = {
      'market_analysis': 'MARKET_INSIGHTS',
      'condo_review': 'PROPERTY_REVIEWS',
      'news_update': 'PROPERTY_NEWS',
      'buyer_guide': 'BUYING_GUIDE'
    };
    return mapping[type] || 'MARKET_INSIGHTS';
  }

  // Get today's scheduled content
  getTodayContent(): ContentItem | null {
    const today = new Date().toISOString().split('T')[0];
    return this.calendar.find(item => 
      item.scheduledDate.toISOString().split('T')[0] === today
    ) || null;
  }

  // Get tomorrow's scheduled content
  getTomorrowContent(): ContentItem | null {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return this.calendar.find(item => 
      item.scheduledDate.toISOString().split('T')[0] === tomorrowStr
    ) || null;
  }

  // Get upcoming content for specified days
  getUpcomingContent(days: number): ContentItem[] {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + days);
    
    return this.calendar.filter(item => 
      item.scheduledDate >= today && item.scheduledDate <= endDate
    );
  }

  // Add reactive content for breaking news
  addReactiveContent(trigger: string, customData?: Record<string, string>): ContentItem | null {
    const reactiveRule = this.contentRules.reactive.find(rule => rule.trigger === trigger);
    if (!reactiveRule) return null;

    const today = new Date();
    const reactiveContent: ContentItem = {
      id: `reactive-${trigger}-${today.getTime()}`,
      title: this.generateTitle(reactiveRule.template, today),
      type: reactiveRule.type,
      category: this.mapTypeToCategory(reactiveRule.type),
      scheduledDate: today,
      scheduledTime: '12:00', // Immediate publish
      status: 'planned',
      agent: reactiveRule.agent,
      priority: reactiveRule.priority
    };

    // Replace custom data if provided
    if (customData) {
      Object.entries(customData).forEach(([key, value]) => {
        reactiveContent.title = reactiveContent.title.replace(`{${key}}`, value);
      });
    }

    this.calendar.push(reactiveContent);
    return reactiveContent;
  }
}

export default ContentCalendarEngine;