// Create a static admin page that redirects to Tina CMS
const fs = require('fs');
const path = require('path');

console.log('Creating static admin page...');

// Create admin directory if it doesn't exist
const adminDir = path.join(process.cwd(), 'out', 'admin');
if (!fs.existsSync(adminDir)) {
  fs.mkdirSync(adminDir, { recursive: true });
  console.log('Created admin directory');
}

// HTML content for the admin page
const htmlContent = `<!DOCTYPE html>
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

// Write the admin index.html file
fs.writeFileSync(path.join(adminDir, 'index.html'), htmlContent);
console.log('Created admin index.html');

// Also create in root admin folder
fs.writeFileSync(path.join(process.cwd(), 'out', 'admin.html'), htmlContent);
console.log('Created admin.html in root');

console.log('Admin page created successfully!'); 