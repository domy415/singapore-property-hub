// Simple test for Claude API migration without database dependencies
require('dotenv').config({ path: '.env.local' });

const Anthropic = require('@anthropic-ai/sdk');

async function testClaudeConnection() {
  console.log('🧪 Testing Claude API Connection...\n');
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment');
    return false;
  }
  
  if (process.env.ANTHROPIC_API_KEY === 'sk-ant-api03-your-actual-claude-api-key-goes-here') {
    console.error('❌ ANTHROPIC_API_KEY appears to be a placeholder. Please update with your actual API key.');
    return false;
  }
  
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    console.log('✅ Anthropic client created successfully');
    
    // Test simple API call
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: 'Hello! Please respond with "Claude API is working properly" to confirm the connection.'
      }]
    });
    
    const responseText = response.content[0].text;
    console.log('✅ API call successful');
    console.log('📨 Response:', responseText);
    
    if (responseText.toLowerCase().includes('claude api is working')) {
      console.log('🎉 Claude API integration test PASSED!');
      return true;
    } else {
      console.log('⚠️  Unexpected response format, but API is working');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Claude API test failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.error('💡 Check your API key - it may be invalid or expired');
    } else if (error.message.includes('rate limit')) {
      console.error('💡 Rate limit exceeded - wait a moment and try again');
    }
    
    return false;
  }
}

async function testPropertyContentGeneration() {
  console.log('\n🏠 Testing Property Content Generation with Claude...\n');
  
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `
<context>
You are a Singapore property expert writing for Business Times readers.
</context>

<task>
Write a brief 300-word article about Singapore's property market in 2025. Include the title, excerpt, and content in JSON format.
</task>

<requirements>
- Return valid JSON only
- Include title, excerpt, content fields
- Focus on Singapore property market
- Professional business tone
</requirements>`
      }],
      temperature: 0.7
    });
    
    const responseText = response.content[0].text;
    console.log('Raw response:', responseText.substring(0, 200) + '...');
    
    // Clean the response text before parsing JSON
    const cleanedText = responseText
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\n/g, '\\n')           // Escape newlines
      .replace(/\r/g, '\\r')           // Escape carriage returns
      .replace(/\t/g, '\\t');          // Escape tabs
    
    const articleData = JSON.parse(cleanedText);
    
    console.log('✅ Property content generation successful');
    console.log('📝 Title:', articleData.title);
    console.log('📄 Excerpt:', articleData.excerpt);
    console.log('📊 Content length:', articleData.content ? articleData.content.length : 0, 'characters');
    
    return true;
  } catch (error) {
    console.error('❌ Property content generation test failed:');
    console.error('Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Claude API Migration Tests\n');
  
  const connectionTest = await testClaudeConnection();
  const contentTest = connectionTest ? await testPropertyContentGeneration() : false;
  
  console.log('\n📊 Final Results:');
  console.log(`📡 API Connection: ${connectionTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📝 Content Generation: ${contentTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (connectionTest && contentTest) {
    console.log('\n🎉 All tests passed! Claude API migration is working correctly.');
    console.log('✅ You can now update your ANTHROPIC_API_KEY with a real API key and test the full system.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the error messages above.');
  }
}

runTests().catch(console.error);