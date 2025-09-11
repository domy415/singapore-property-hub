#!/usr/bin/env node

/**
 * Manual script to update developer domains in Next.js config
 * Run with: node scripts/update-domains.js
 */

const { DeveloperDomainManager } = require('../src/services/developer-domain-manager.ts')

async function main() {
  console.log('🔍 Developer Domain Management Script')
  console.log('=====================================\n')

  try {
    const domainManager = new DeveloperDomainManager()

    // Step 1: Validate current domains
    console.log('1. Validating current domain whitelist...')
    const validation = await domainManager.validateDomainWhitelist()
    console.log(validation.report)

    // Step 2: Auto-update if missing domains found
    if (validation.missing.length > 0) {
      console.log('\n2. Auto-updating missing domains...')
      const updateResult = await domainManager.autoUpdateDomains()
      
      console.log(`✅ Domain update complete:`)
      console.log(`  - Extracted: ${updateResult.extraction.domains.length} domains`)
      console.log(`  - Added: ${updateResult.update.added.length} new domains`)
      console.log(`  - Skipped: ${updateResult.update.skipped.length} existing domains\n`)

      if (updateResult.update.added.length > 0) {
        console.log('🚀 Next.js config updated! You may need to restart your development server.')
        console.log('   New domains added:', updateResult.update.added.join(', '))
      }
    } else {
      console.log('\n✅ All domains are already whitelisted!')
    }

    // Step 3: Final validation
    console.log('\n3. Final validation...')
    const finalValidation = await domainManager.validateDomainWhitelist()
    
    if (finalValidation.missing.length === 0) {
      console.log('🎉 All developer domains are properly whitelisted!')
    } else {
      console.log('⚠️ Some domains still missing:', finalValidation.missing)
    }

  } catch (error) {
    console.error('❌ Script failed:', error.message)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Script error:', error)
    process.exit(1)
  })
}

module.exports = { main }