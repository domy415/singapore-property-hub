# Session 20 - OpenAI Web Fact-Checker Setup

## ✅ OpenAI Web Fact-Checker Active

The fact-checking system uses OpenAI's GPT-4 with web search capabilities to verify Singapore property information.

### Features:

1. **Web Search Integration**
   - Simulates web searches for official Singapore government sources
   - Verifies ABSD rates, LTV limits, and property regulations
   - Checks district information and market data

2. **Smart Fact Extraction**
   - Automatically extracts verifiable claims from articles
   - Focuses on numbers, rates, and factual statements
   - Maximum 15 claims per article for efficiency

3. **Comprehensive Verification**
   - Checks claims against current 2025 data
   - Identifies incorrect, outdated, or unverifiable information
   - Provides corrections when facts are wrong

4. **Quality Scoring**
   - Calculates accuracy score (0-100)
   - Requires 80+ score for publication
   - Gracefully handles opinion-based content

## ⚙️ Configuration

### Enable Web Fact-Checking

To enable the web fact-checking feature:

```bash
# In Vercel Dashboard:
USE_WEB_FACT_CHECKER = "true"
```

### Configure CRON_SECRET

For daily automated content generation:

```bash
# In Vercel Dashboard:
CRON_SECRET = "your-secure-random-string"
```

## 🧪 Testing

1. **Test Fact-Checker**:
   ```
   GET /api/test-web-fact-checker
   ```

2. **Test Content Generation with Fact-Checking**:
   ```
   GET /api/test-verified-content
   ```

## 📊 How It Works

1. **Article Generation**: Content is created using OpenAI GPT-4
2. **Claim Extraction**: Key facts are extracted for verification
3. **Web Search Simulation**: Each claim is verified against authoritative sources
4. **Scoring**: Articles receive a quality score based on accuracy
5. **Publication Gate**: Only articles with 80+ scores are published

## 🔍 Verified Sources

The fact-checker prioritizes these Singapore government sources:
- IRAS (iras.gov.sg) - ABSD rates and stamp duties
- MAS (mas.gov.sg) - LTV limits and cooling measures
- URA (ura.gov.sg) - Property data and statistics
- MND (mnd.gov.sg) - Housing policies

## 🛡️ Security

- OpenAI API key already configured in Vercel
- No additional API keys needed
- All fact-checking happens server-side
- No sensitive data exposed to client

---

Last Updated: Session 20 - OpenAI Web Fact-Checker