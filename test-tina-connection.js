const fetch = require('node-fetch');

// Using the credentials from your config.ts file
const CLIENT_ID = 'cb9f95e2-759f-482c-a863-7ed5bc3309cb';
// Try a different token from your screenshots
const TOKEN = '7d2c087b403f429bf72ddfbcdfe5bda2331f655f';

async function testTinaConnection() {
  console.log('==========================================');
  console.log('TESTING TINACMS CONNECTION');
  console.log('==========================================');
  console.log('Testing TinaCMS connection with credentials from config.ts');
  console.log('Client ID:', CLIENT_ID);
  console.log('Token (first 6 chars):', TOKEN.substring(0, 6) + '...');
  
  try {
    // Test basic connectivity
    console.log('\nTesting connectivity to content.tinajs.io...');
    
    const url = `https://content.tinajs.io/content/${CLIENT_ID}/github/main`;
    console.log(`Request URL: ${url}`);
    
    console.log('Sending request...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        query: `{
          # Simple query to check authentication
          __typename
        }`
      })
    });
    
    console.log(`\nResponse status: ${response.status}`);
    console.log(`Response status text: ${response.statusText}`);
    
    const text = await response.text();
    console.log(`Response body: ${text}`);
    
    if (response.ok) {
      console.log('\n✅ SUCCESS: Connection to TinaCMS API successful!');
    } else {
      console.log('\n❌ ERROR: Could not connect to TinaCMS API');
      if (response.status === 401) {
        console.log('Authentication failed - invalid credentials');
        console.log('Please check your client ID and token in tina/config.ts');
      }
    }
  } catch (error) {
    console.error('\n❌ Error testing TinaCMS connection:', error.message);
  }
  console.log('==========================================');
}

testTinaConnection(); 