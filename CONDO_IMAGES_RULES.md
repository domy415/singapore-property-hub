# ⚠️ CRITICAL: CONDO IMAGE RULES - FOR SPECIFIC AGENTS/FILES ONLY

## 🎯 SCOPE: TARGETED ENFORCEMENT

This rule applies ONLY to specific agents and files that directly handle condo images. Other parts of the system can operate normally.

## ✅ AFFECTED AGENTS:

### 1. property-article-writer
- **WHEN**: Writing condo reviews or property-specific articles
- **RULE**: MUST use developer images from `verified-condo-images.ts`
- **EXEMPT**: Market analysis, policy articles (can use charts/graphs)

### 2. singapore-property-report-generator  
- **WHEN**: Including property photos in reports
- **RULE**: MUST use verified developer images for property photos
- **EXEMPT**: Charts, graphs, maps, logos (can be generic/generated)

## ❌ EXEMPT AGENTS:

### singapore-property-scorer
- **NO IMAGE REQUIREMENTS**: Pure data analysis agent
- **FOCUS**: Scoring and metrics only
- **STATUS**: Can operate without image restrictions

### linkedin-property-content-optimizer
- **USES EXISTING**: References images from published articles
- **NO DIRECT SELECTION**: Doesn't select condo images directly
- **STATUS**: Can suggest crops/highlights from existing content

## 📁 AFFECTED FILES ONLY:

```
src/lib/condo-data.ts                    ← Condo listing data
src/app/condos/page.tsx                  ← Condo listing page  
src/app/condos/[slug]/page.tsx          ← Individual condo pages
src/components/CondoImageGallery.tsx     ← Image gallery component
src/data/condo-developer-images.ts      ← Developer image sources
```

## 🚫 FORBIDDEN IMAGES (for affected files only):

### NEVER USE:
- `images.unsplash.com/*`
- `images.pexels.com/*` 
- `stockphoto.com/*`
- Any generic apartment/building stock photos

### ALWAYS USE:
1. **First Priority**: Official developer website images
   - `thegranddunman.sg/wp-content/uploads/*`
   - `continuum-condo.sg/wp-content/uploads/*`
   - `lentor-mansion.com.sg/wp-content/uploads/*`
   - `orchard-sophia.sg/wp-content/uploads/*`
   - `avenue-south.sg/wp-content/uploads/*`
   - `normanton-park.sg/wp-content/uploads/*`

2. **Second Priority**: PropertyGuru/EdgeProp project CDN
   - Verified project-specific images only

3. **Local Storage**: `/images/condos/[project-name]/`
   - Downloaded developer images stored locally

## 🔍 VERIFICATION PROCESS:

### For Affected Agents Only:
1. **Check Image Source**: Is this a condo-specific image?
2. **Verify Developer Origin**: Does URL come from official developer site?
3. **Test URL**: Does image load properly?
4. **Update Data**: Use `verified-condo-images.ts` mapping

### For Other Agents:
- Normal image selection process applies
- No additional verification required

## ⚡ QUICK REFERENCE:

```javascript
// IN AFFECTED FILES ONLY:
if (workingOnCondoPages || workingOnCondoData) {
  → Use ONLY verified developer images
  → Check verified-condo-images.ts
  → NO stock photos allowed
} else {
  → Normal image selection process
  → Charts/graphs/maps OK
  → Generic images allowed for non-condo content
}
```

## 🎯 ENFORCEMENT SCOPE:

### CHECK THESE:
- Condo listing thumbnails
- Condo detail page galleries  
- Property-specific review images
- Developer marketing materials

### DON'T CHECK THESE:
- Market analysis charts
- Policy article illustrations
- LinkedIn post graphics
- General website images
- Location maps (non-property specific)

---

**Last Updated**: January 2025  
**Scope**: Targeted enforcement for condo-specific components only