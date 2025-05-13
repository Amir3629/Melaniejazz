// tina-test.js - Script to test if TinaCMS credentials are valid

// Set environment variables directly
process.env.NEXT_PUBLIC_TINA_CLIENT_ID = '2bb269d0-f1cd-4790-b228-668c2d338efe';
process.env.TINA_TOKEN = 'b17fdbf924cf68a48b293d1187dc514e702dfd7';

console.log('Testing TinaCMS credentials:');
console.log('Client ID:', process.env.NEXT_PUBLIC_TINA_CLIENT_ID);
console.log('Token:', process.env.TINA_TOKEN.substring(0, 5) + '...'); // Only show first 5 chars for security

// Import TinaCMS config
const tinaConfig = require('./tina/config.ts');

console.log('TinaCMS Config loaded successfully');
console.log('Config client ID:', tinaConfig.clientId);
console.log('Config branch:', tinaConfig.branch);

// Test if credentials are working
const fetch = require('node-fetch');

async function testTinaCredentials() {
  const url = `https://content.tinajs.io/content/${process.env.NEXT_PUBLIC_TINA_CLIENT_ID}/github/main`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TINA_TOKEN}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    const data = await response.text();
    console.log('Response body:', data.substring(0, 100) + '...'); // Show first 100 chars
    
    return response.ok;
  } catch (error) {
    console.error('Error testing TinaCMS credentials:', error.message);
    return false;
  }
}

testTinaCredentials()
  .then(isValid => {
    console.log('Credentials valid:', isValid);
    process.exit(isValid ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  }); 