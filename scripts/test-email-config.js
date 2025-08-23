// Test Email Configuration
const nodemailer = require('nodemailer');

console.log('Email Configuration Test\n');
console.log('================================');

// Check environment variables
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const notificationEmail = process.env.NOTIFICATION_EMAIL;

console.log('\n1. Environment Variables:');
console.log('   SMTP_HOST:', smtpHost || '✗ Not set');
console.log('   SMTP_PORT:', smtpPort || '✗ Not set');
console.log('   SMTP_USER:', smtpUser ? `✓ Set (${smtpUser})` : '✗ Not set');
console.log('   SMTP_PASS:', smtpPass ? '✓ Set' : '✗ Not set');
console.log('   NOTIFICATION_EMAIL:', notificationEmail || '✗ Not set');

const isConfigured = smtpHost && smtpUser && smtpPass;
console.log('\n2. Configuration Status:');
console.log('   Email System:', isConfigured ? '✓ Configured' : '✗ Not configured');

if (!isConfigured) {
  console.log('\n⚠️  Email system is not configured!');
  console.log('\nTo configure email notifications:');
  console.log('1. Go to Vercel Dashboard: https://vercel.com/dashboard');
  console.log('2. Select your project: singapore-property-hub');
  console.log('3. Go to Settings → Environment Variables');
  console.log('4. Add the following variables:');
  if (!smtpHost) console.log('   - SMTP_HOST (e.g., smtp.gmail.com)');
  if (!smtpPort) console.log('   - SMTP_PORT (e.g., 587)');
  if (!smtpUser) console.log('   - SMTP_USER (your Gmail address)');
  if (!smtpPass) console.log('   - SMTP_PASS (Gmail App Password)');
  if (!notificationEmail) console.log('   - NOTIFICATION_EMAIL (where to send notifications)');
  console.log('\nFor Gmail App Password:');
  console.log('1. Enable 2-factor authentication on your Google account');
  console.log('2. Go to: https://myaccount.google.com/apppasswords');
  console.log('3. Create an app password for "Mail"');
} else {
  console.log('\n✅ Email system is configured!');
  console.log('\n3. Testing SMTP Connection...');
  
  // Test the connection
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort || '587'),
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.verify(function(error, success) {
    if (error) {
      console.log('\n❌ SMTP Connection Failed:');
      console.log(error.message);
      console.log('\nPossible issues:');
      console.log('- Invalid credentials');
      console.log('- Gmail App Password not set up correctly');
      console.log('- Firewall blocking SMTP port');
    } else {
      console.log('\n✅ SMTP Connection Successful!');
      console.log('Email notifications are ready to send.');
      console.log('\nEmail will be sent:');
      console.log('- FROM:', smtpUser);
      console.log('- TO:', notificationEmail || 'agent@singaporepropertyhub.sg');
    }
  });
}