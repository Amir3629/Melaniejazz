// Simple test script for TinaCMS
const fetch = require('node-fetch');

const CLIENT_ID = 'cb9f95e2-759f-482c-a863-7ed5bc3309cb';
// WARNING: Tokens should NEVER be hardcoded in real code. This is just for testing.
const TOKEN = '8722188aceba0231d42dcf7b488a2f93e2725785'; 

// Try without any quotes or special formatting
async function testTina() {
  console.log('Testing TinaCMS credentials');
  console.log('Client ID:', CLIENT_ID);
  console.log('Token (first 5 chars):', TOKEN.substring(0, 5) + '...');
  
  try {
    // First test connectivity to tina.io
    console.log('Testing connectivity to tina.io...');
    try {
      const pingResponse = await fetch('https://tina.io', { 
        method: 'HEAD',
        timeout: 5000
      });
      console.log('Can reach tina.io:', pingResponse.ok);
    } catch (pingError) {
      console.error('Cannot reach tina.io:', pingError.message);
      return {success: false, error: 'Cannot reach tina.io'};
    }
    
    console.log('\nTrying to verify TinaCMS credentials...');
    
    // Construct the request URL
    const url = `https://content.tinajs.io/content/${CLIENT_ID}/github/main`;
    console.log('Request URL:', url);
    
    // Try the request with minimal parameters 
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN, // No template literals, just simple concatenation
      },
      body: JSON.stringify({
        query: '{__typename}'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    const text = await response.text();
    console.log('Response text (truncated):', text.substring(0, 300));
    
    if (response.status === 401) {
      console.log('\nERROR: Unauthorized (401). This means your credentials are not correct.');
      console.log('Please double-check your Client ID and Token from TinaCMS.');
    }
    
    return {success: response.ok, status: response.status, message: response.statusText};
  } catch (error) {
    console.error('Error:', error.message);
    return {success: false, error: error.message};
  }
}

testTina().then(result => {
  console.log('\nTest completed:', result);
  
  if (!result.success) {
    console.log('\nRECOMMENDATION:');
    console.log('It appears your TinaCMS credentials are not working properly.');
    console.log('Please visit https://app.tina.io/ and regenerate your tokens.');
    console.log('Make sure to update them in .env.local and your GitHub secrets.');
  }
}); 