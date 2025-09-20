# Singapore Property Hub AI Agents

This directory contains all AI agents used by the Singapore Property Hub platform for automated content generation and analysis.

## Agent Directory

### 1. **property-article-writer.ts**
- **Purpose**: Primary content generation agent for property articles
- **Output**: 2000-2500 word SEO-optimized articles
- **Features**: Market analysis, buyer guides, location guides
- **Integration**: Used by verified-content-generator.ts

### 2. **singapore-property-scorer.ts** 
- **Purpose**: Comprehensive property scoring using DQI methodology
- **Output**: 0-100 DQI scores with detailed breakdowns
- **Dimensions**: Location, Developer, Design, Facilities, Build Quality, Investment
- **Integration**: Required for all condo reviews (feeds into article writer)

### 3. **singapore-property-report-generator.ts**
- **Purpose**: Professional one-page property reports
- **Output**: HTML format (email attachments) + PDF format (downloads)
- **Features**: Charts, ratings, key insights extraction
- **Integration**: Processes completed articles into report format

### 4. **linkedin-property-content-optimizer.ts**
- **Purpose**: Social media optimization for LinkedIn
- **Output**: Optimized post headlines, snippets, hashtags
- **Features**: Engagement strategies, professional networking focus
- **Integration**: Final step in content pipeline before publication

### 5. **agent-fact-checker-web.ts**
- **Purpose**: Web-enabled fact-checking and content validation
- **Output**: Accuracy scores (80+ required for publication)
- **Features**: Singapore property regulation validation, market data verification
- **Integration**: Quality gate before content publication

## Workflow Integration

### Mandatory DQI Scoring Workflow:
1. **singapore-property-scorer** → generates DQI scores (0-100)
2. **property-article-writer** → uses DQI data for content
3. **agent-fact-checker-web** → validates content accuracy (80+ score)
4. **singapore-property-report-generator** → creates downloadable reports
5. **linkedin-property-content-optimizer** → optimizes for social sharing

### Content Generation Pipeline:
```
Topic Selection → Property Scoring (if condo) → Article Writing → Fact Checking → Report Generation → LinkedIn Optimization → Publication
```

## Quality Standards

- **DQI Compliance**: All condo ratings must come from DQI scoring (no arbitrary values)
- **Fact-Check Gate**: 80+ accuracy score required for publication
- **Singapore Context**: All content must be relevant to Singapore property market
- **Professional Standards**: Business Times editorial style and quality

## Agent Location

- **Primary**: `singapore-property-hub\agents\` (this directory)
- **Implementation**: `singapore-property-hub\src\services\` (service wrappers)
- **Integration**: Content generators reference both locations

## Usage Notes

- Agents are TypeScript modules that can be imported and used programmatically
- Each agent has specific input/output requirements documented in the file headers
- All agents are designed to work both independently and as part of the integrated workflow
- Error handling includes graceful fallbacks when agents are unavailable

---

*Last Updated: September 2025 - DQI Workflow Implementation*