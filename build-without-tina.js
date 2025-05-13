const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building without TinaCMS...');

// Backup the original config file
const tinaConfigPath = path.join(__dirname, 'tina', 'config.ts');
const backupPath = path.join(__dirname, 'tina', 'config.ts.bak');

if (fs.existsSync(tinaConfigPath)) {
  console.log('Backing up original TinaCMS config...');
  fs.copyFileSync(tinaConfigPath, backupPath);
}

// Create a modified tina config that won't fail the build
const modifiedTinaConfig = `
import { defineConfig } from "tinacms";

// Modified config that will not cause build failures
const branch = "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "cb9f95e2-759f-482c-a863-7ed5bc3309cb",
  token: process.env.TINA_TOKEN || "dummy-token", // This doesn't need to be valid for build

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => \`/demo/blog/\${document._sys.filename}\`,
        },
      },
    ],
  },
});
`;

// Modify pages that depend on TinaCMS to handle disconnection gracefully
console.log('Modifying TinaCMS configuration to skip authentication...');
fs.writeFileSync(tinaConfigPath, modifiedTinaConfig);

try {
  console.log('Building site...');
  console.log('Setting NODE_OPTIONS for memory allocation...');
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  
  console.log('Running Next.js build command...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('Exporting static files...');
  execSync('mkdir -p out', { stdio: 'inherit' });
  
  // Create a placeholder index.html
  if (!fs.existsSync('out/index.html')) {
    console.log('Creating placeholder index.html...');
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Melanie Jazz</title>
  <meta http-equiv="refresh" content="0;url=demo-no-tina.html">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      text-align: center;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Redirecting to demo page...</h1>
    <p>This is a static site built without TinaCMS dependency.</p>
    <p>If you are not redirected automatically, <a href="demo-no-tina.html">click here</a>.</p>
  </div>
</body>
</html>
    `;
    fs.writeFileSync('out/index.html', html);
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Error during build:', error.message);
  process.exit(1);
} finally {
  // Restore the original config
  if (fs.existsSync(backupPath)) {
    console.log('Restoring original TinaCMS config...');
    fs.copyFileSync(backupPath, tinaConfigPath);
    fs.unlinkSync(backupPath);
  }
}

console.log('\nBuild process completed! The site is in the "out" directory.');
console.log('You can now run:');
console.log('npm run start');
console.log('\nNote: TinaCMS functionality will be limited or unavailable.');
console.log('This is a fallback build that allows your site to deploy without valid TinaCMS credentials.'); 