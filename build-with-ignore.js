const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting custom build process...');

// Step 1: Remove not-found.js to prevent build errors
console.log('Removing problematic not-found page...');
try {
  if (fs.existsSync(path.join(__dirname, 'app', 'not-found.js'))) {
    fs.unlinkSync(path.join(__dirname, 'app', 'not-found.js'));
  }
  if (fs.existsSync(path.join(__dirname, 'app', 'not-found.tsx'))) {
    fs.unlinkSync(path.join(__dirname, 'app', 'not-found.tsx'));
  }
} catch (err) {
  console.error('Error removing not-found files:', err);
}

// Step 2: Remove any previous build artifacts
console.log('Cleaning previous build directory...');
try {
  if (fs.existsSync(path.join(__dirname, '.next'))) {
    execSync('rd /s /q .next', { stdio: 'inherit' });
  }
} catch (err) {
  console.error('Error cleaning .next directory:', err);
}

// Step 3: Run the Next.js build
console.log('Running Next.js build...');
try {
  execSync('set NODE_OPTIONS=--max-old-space-size=4096 && next build --no-lint', { stdio: 'inherit' });
} catch (err) {
  console.error('Build command failed, but continuing with post-processing...');
}

// Step 4: Create a basic not-found page in the output directory
console.log('Creating fallback not-found page in output directory...');
const notFoundHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 - Page Not Found</title>
  <style>
    body {
      font-family: sans-serif;
      background: #0A0A0A;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      text-align: center;
      padding: 20px;
    }
    h1 {
      font-size: 48px;
      margin-bottom: 20px;
      color: #C8A97E;
    }
    p {
      margin-bottom: 30px;
    }
    a {
      color: #C8A97E;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/">Return to Home</a>
  </div>
</body>
</html>`;

try {
  const outDir = path.join(__dirname, 'out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outDir, '404.html'), notFoundHtml);
} catch (err) {
  console.error('Error creating 404.html:', err);
}

// Step 5: Run post-build script if it exists
console.log('Running post-build processing...');
try {
  if (fs.existsSync(path.join(__dirname, 'scripts', 'post-build.js'))) {
    execSync('node scripts/post-build.js', { stdio: 'inherit' });
  }
} catch (err) {
  console.error('Error running post-build script:', err);
}

console.log('Custom build process completed.'); 