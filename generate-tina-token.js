const https = require('https');
const fs = require('fs');

// Client ID from TinaCMS
const CLIENT_ID = 'cb9f95e2-759f-482c-a863-7ed5bc3309cb';

console.log('Generating token for TinaCMS...');
console.log('Client ID:', CLIENT_ID);

// Try multiple tokens from screenshots to see which one works
const tokensToTry = [
  '7d2c087b403f429bf72ddfbcdfe5bda2331f655f',
  '8722188aceba0231d42dcf7b488a2f93e2725785',
  '32851a9831fcbb67bbf8d1aecb6d8b9c5ce4f84c'
];

function testToken(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'content.tinajs.io',
      port: 443,
      path: `/content/${CLIENT_ID}/github/main`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Token: ${token.substring(0, 6)}... - Status: ${res.statusCode}`);
        resolve({
          token,
          statusCode: res.statusCode,
          data
        });
      });
    });
    
    req.on('error', (error) => {
      console.error('Error testing token:', error.message);
      reject(error);
    });
    
    req.write(JSON.stringify({
      query: '{__typename}'
    }));
    
    req.end();
  });
}

async function testAllTokens() {
  console.log('Testing all tokens...');
  
  for (const token of tokensToTry) {
    try {
      const result = await testToken(token);
      
      if (result.statusCode === 200) {
        console.log(`\nSUCCESS! Found working token: ${token.substring(0, 6)}...`);
        
        // Update the .env.local file
        const envContent = `NEXT_PUBLIC_TINA_CLIENT_ID=${CLIENT_ID}\nTINA_TOKEN=${token}\nTINA_PUBLIC_IS_LOCAL=true\n`;
        fs.writeFileSync('.env.local', envContent);
        console.log('Updated .env.local file with working token');
        
        // Also update tina/config.ts
        let tinaConfig = fs.readFileSync('./tina/config.ts', 'utf8');
        tinaConfig = tinaConfig.replace(
          /token: process\.env\.TINA_TOKEN \|\| ["']([^"']+)["']/,
          `token: process.env.TINA_TOKEN || "${token}"`
        );
        fs.writeFileSync('./tina/config.ts', tinaConfig);
        console.log('Updated tina/config.ts with working token');
        
        return true;
      }
    } catch (error) {
      console.error(`Error with token ${token.substring(0, 6)}...`, error.message);
    }
  }
  
  console.log('\nFAILED: No working token found.');
  return false;
}

testAllTokens()
  .then(success => {
    if (success) {
      console.log('\nToken generation and configuration complete. You can now run:');
      console.log('npm run dev');
    } else {
      console.log('\nFailed to find a working token. Try generating a new token from TinaCMS dashboard.');
    }
  })
  .catch(error => {
    console.error('Error in token generation process:', error);
  }); 