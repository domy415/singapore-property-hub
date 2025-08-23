// Check LinkedIn Configuration Status
console.log('LinkedIn Configuration Check\n');
console.log('================================');

// Check environment variables
const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
const personId = process.env.LINKEDIN_PERSON_ID;
const clientId = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

console.log('\n1. Environment Variables:');
console.log('   LINKEDIN_ACCESS_TOKEN:', accessToken ? `✓ Set (${accessToken.substring(0, 10)}...)` : '✗ Not set');
console.log('   LINKEDIN_PERSON_ID:', personId ? `✓ Set (${personId})` : '✗ Not set');
console.log('   LINKEDIN_CLIENT_ID:', clientId ? `✓ Set (${clientId})` : '✗ Not set');
console.log('   LINKEDIN_CLIENT_SECRET:', clientSecret ? '✓ Set' : '✗ Not set');

console.log('\n2. Configuration Status:');
const isConfigured = accessToken && personId;
console.log('   LinkedIn Integration:', isConfigured ? '✓ Ready' : '✗ Not configured');

if (!isConfigured) {
  console.log('\n⚠️  LinkedIn integration is not fully configured!');
  console.log('\nTo configure LinkedIn:');
  console.log('1. Go to Vercel Dashboard: https://vercel.com/dashboard');
  console.log('2. Select your project: singapore-property-hub');
  console.log('3. Go to Settings → Environment Variables');
  console.log('4. Add the following variables:');
  if (!accessToken) console.log('   - LINKEDIN_ACCESS_TOKEN');
  if (!personId) console.log('   - LINKEDIN_PERSON_ID');
  console.log('\nFor detailed setup instructions, see LINKEDIN_MANUAL_TOKEN_SETUP.md');
} else {
  console.log('\n✅ LinkedIn integration is configured and ready to use!');
  console.log('\nYou can now:');
  console.log('- Visit /admin/linkedin to manage LinkedIn posts');
  console.log('- Articles will be automatically posted to LinkedIn');
}