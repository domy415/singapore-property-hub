# Singapore Property Hub AI Agents

This directory contains AI agent definitions and instructions for the Singapore Property Hub platform. These are documentation files that define how AI agents should behave and what they should produce.

## Important: This folder contains ONLY agent definitions (.md files)
- **Agent Instructions**: .md files with detailed specifications
- **Executable Code**: Located in `src/services/` and `src/lib/`
- **Utility Scripts**: Located in `scripts/`

## Agent Directory

### 1. **property-article-writer.md**
- **Purpose**: Instructions for primary content generation agent
- **Defines**: 2000-2500 word SEO-optimized article requirements
- **Covers**: Market analysis, buyer guides, location guides
- **Code Location**: `src/services/property-article-writer.ts`

### 2. **singapore-property-scorer.md** 
- **Purpose**: Instructions for comprehensive property DQI scoring
- **Defines**: 0-100 DQI scoring methodology and dimensions
- **Covers**: Location, Developer, Design, Facilities, Build Quality, Investment
- **Code Location**: `src/services/singapore-property-scorer.ts`

### 3. **singapore-property-report-generator.md**
- **Purpose**: Instructions for professional property report generation
- **Defines**: HTML and PDF report format requirements
- **Covers**: Charts, ratings, key insights extraction
- **Code Location**: `src/services/singapore-property-report-generator.ts`

### 4. **linkedin-property-content-optimizer.md**
- **Purpose**: Instructions for LinkedIn social media optimization
- **Defines**: Post formatting, hashtag, and engagement requirements
- **Covers**: Professional networking and content distribution
- **Code Location**: `src/services/linkedin-property-content-optimizer.ts`

### 5. **fact-checker-web.md** (referenced implementation)
- **Purpose**: Instructions for web-enabled fact-checking
- **Defines**: Accuracy scoring and validation requirements
- **Covers**: Singapore property regulation validation
- **Code Location**: `src/lib/agent-fact-checker-web.ts`

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

## File Organization

- **Agent Instructions**: `agents/` (this directory - .md files only)
- **Service Code**: `src/services/` (executable .ts files)
- **Utility Code**: `src/lib/` (helper functions and utilities)
- **Scripts**: `scripts/` (standalone utility scripts)

## Usage Notes

- Agents are TypeScript modules that can be imported and used programmatically
- Each agent has specific input/output requirements documented in the file headers
- All agents are designed to work both independently and as part of the integrated workflow
- Error handling includes graceful fallbacks when agents are unavailable

---

*Last Updated: September 2025 - DQI Workflow Implementation*