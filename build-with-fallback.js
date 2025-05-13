const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build with TinaCMS fallback...');

// Check if TinaCMS credentials are available
const hasClientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID || false;
const hasToken = process.env.TINA_TOKEN || false;

console.log(`TinaCMS Client ID available: ${Boolean(hasClientId)}`);
console.log(`TinaCMS Token available: ${Boolean(hasToken)}`);

try {
  // Try to build with TinaCMS
  console.log('Attempting to build with TinaCMS...');
  
  // Create temp .env.local file if needed
  if (!fs.existsSync('.env.local')) {
    console.log('Creating temporary .env.local file with TinaCMS credentials from config.ts...');
    const tinaConfig = fs.readFileSync(path.join(__dirname, 'tina', 'config.ts'), 'utf8');
    
    // Extract clientId and token from config file using regex
    const clientIdMatch = tinaConfig.match(/clientId:.*?["']([^"']+)["']/);
    const tokenMatch = tinaConfig.match(/token:.*?["']([^"']+)["']/);
    
    if (clientIdMatch && clientIdMatch[1] && tokenMatch && tokenMatch[1]) {
      const clientId = clientIdMatch[1];
      const token = tokenMatch[1];
      
      const envContent = `NEXT_PUBLIC_TINA_CLIENT_ID=${clientId}\nTINA_TOKEN=${token}\nTINA_PUBLIC_IS_LOCAL=true\n`;
      fs.writeFileSync('.env.local.temp', envContent);
      console.log('Created temporary environment file with extracted credentials');
    }
  }
  
  // Try building with TinaCMS
  execSync('tinacms build && next build --no-lint', { stdio: 'inherit' });
  console.log('TinaCMS build completed successfully!');
} catch (error) {
  console.error('Error during TinaCMS build:', error.message);
  console.log('Falling back to regular Next.js build...');
  
  try {
    // Fall back to regular Next.js build
    execSync('next build --no-lint', { stdio: 'inherit' });
    console.log('Fallback build completed successfully!');
  } catch (buildError) {
    console.error('Error during fallback build:', buildError.message);
    process.exit(1);
  }
}

// Clean up temporary files
if (fs.existsSync('.env.local.temp')) {
  fs.unlinkSync('.env.local.temp');
}

console.log('Build process completed!'); 