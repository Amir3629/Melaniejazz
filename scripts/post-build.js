/**
 * Post-build script for static site deployment
 * This script runs after the Next.js build to prepare the output for deployment
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const isVercel = process.env.VERCEL === "1";

console.log(`Running post-build script. Vercel environment: ${isVercel ? 'Yes' : 'No'}`);

// Ensure the out directory exists
if (!fs.existsSync(outDir)) {
  console.error('❌ Output directory not found. Make sure the build completed successfully.');
  process.exit(1);
}

// Create .nojekyll file (prevents GitHub Pages from ignoring files that start with underscore)
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
console.log('✅ Created .nojekyll file');

// Create 404.html file if it doesn't exist in the output
const notFoundPath = path.join(outDir, '404.html');
if (!fs.existsSync(notFoundPath)) {
  // Copy 404.html from public if it exists
  const publicNotFoundPath = path.join(__dirname, '..', 'public', '404.html');
  if (fs.existsSync(publicNotFoundPath)) {
    fs.copyFileSync(publicNotFoundPath, notFoundPath);
    console.log('✅ Copied 404.html from public directory');
  } else {
    // Create a simple 404 page
    const notFoundContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found</title>
  <script>
    // Single Page Apps for GitHub Pages
    // https://github.com/rafgraph/spa-github-pages
    var pathSegmentsToKeep = 0;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
  <style>
    body {
      background-color: #0A0A0A;
      color: white;
      font-family: Arial, sans-serif;
      height: 100vh;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    h1 { font-size: 4rem; margin-bottom: 1rem; }
    p { font-size: 1.25rem; color: #d1d1d1; margin-bottom: 2rem; }
    a { color: #60a5fa; text-decoration: underline; }
    a:hover { color: #93c5fd; }
  </style>
</head>
<body>
  <noscript>
    <div>
      <h1>404</h1>
      <p>Page not found</p>
      <a href="/">Return to Homepage</a>
    </div>
  </noscript>
</body>
</html>`;
    fs.writeFileSync(notFoundPath, notFoundContent);
    console.log('✅ Created 404.html file');
  }
}

// Create a CNAME file if it doesn't exist (uncomment and modify if you have a custom domain)
// const cnamePath = path.join(outDir, 'CNAME');
// if (!fs.existsSync(cnamePath)) {
//   fs.writeFileSync(cnamePath, 'yourdomain.com');
//   console.log('✅ Created CNAME file');
// }

// SPA redirect for GitHub Pages in index.html - only needed for GitHub Pages deployment
if (!isVercel) {
  const indexHtmlPath = path.join(outDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Check if SPA redirect is already in the head
    if (!indexContent.includes('Single Page Apps for GitHub Pages')) {
      // Add SPA redirect script to the head
      indexContent = indexContent.replace('</head>', `  <!-- Start Single Page Apps for GitHub Pages -->
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    (function(l) {
      if (l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
          return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
        );
      }
    }(window.location))
  </script>
  <!-- End Single Page Apps for GitHub Pages -->
</head>`);
      
      fs.writeFileSync(indexHtmlPath, indexContent);
      console.log('✅ Added SPA redirect to index.html');
    }
  }
} else {
  console.log('ℹ️ Skipping GitHub Pages SPA redirect for Vercel deployment');
}

// For Vercel deployment, add a specific indicator file
if (isVercel) {
  fs.writeFileSync(path.join(outDir, 'vercel-deployment.txt'), 'This site is deployed on Vercel');
  console.log('✅ Added Vercel deployment indicator file');
}

// HTML content for the admin page
const adminHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mel Jazz - Admin</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #000;
      color: #fff;
      text-align: center;
    }
    .container {
      max-width: 500px;
      padding: 2rem;
    }
    .logo {
      max-width: 200px;
      margin-bottom: 2rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      margin: 2rem auto;
      background-color: #C8A97E;
      border-radius: 100%;  
      animation: sk-scaleout 1.0s infinite ease-in-out;
    }
    @keyframes sk-scaleout {
      0% { 
        transform: scale(0);
      } 100% {
        transform: scale(1.0);
        opacity: 0;
      }
    }
    a {
      color: #C8A97E;
      text-decoration: none;
      font-weight: bold;
    }
    a:hover {
      text-decoration: underline;
    }
    .btn {
      display: inline-block;
      background-color: #C8A97E;
      color: #000;
      padding: 0.75rem 1.5rem;
      border-radius: 0.25rem;
      margin-top: 1rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: background-color 0.2s ease;
    }
    .btn:hover {
      background-color: #B08A6E;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="/Melaniejazz/images/logo/ml-logo.PNG" alt="Mel Jazz" class="logo" />
    <h1>Mel Jazz Admin</h1>
    <p>Redirecting to Tina CMS Cloud Admin...</p>
    <a href="https://app.tina.io/signin" class="btn">Go to Tina CMS</a>
    <div class="spinner"></div>
    <p><a href="/Melaniejazz">Return to Website</a></p>
  </div>

  <script>
    // Auto redirect to Tina CMS after a short delay
    setTimeout(function() {
      window.location.href = "https://app.tina.io/signin";
    }, 3000);
  </script>
</body>
</html>`;

// Create admin directory if it doesn't exist
const adminDir = path.join(outDir, 'admin');
if (!fs.existsSync(adminDir)) {
  fs.mkdirSync(adminDir, { recursive: true });
  console.log('✅ Created admin directory');
}

// Write the admin index.html file
fs.writeFileSync(path.join(adminDir, 'index.html'), adminHtmlContent);
fs.writeFileSync(path.join(outDir, 'admin.html'), adminHtmlContent);
console.log('✅ Created admin pages');

console.log('✅ Post-build completed successfully!'); 