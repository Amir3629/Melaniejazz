/**
 * This script fixes the paths in the Tina admin files to work with GitHub Pages
 */

const fs = require('fs');
const path = require('path');

const ADMIN_DIR = path.join(process.cwd(), 'out', 'admin');
const BASE_PATH = '/Melaniejazz';

// Make sure the admin directory exists
if (!fs.existsSync(ADMIN_DIR)) {
  console.error('Admin directory not found. Make sure to run this after running the build.');
  process.exit(1);
}

// Read the index.html file
const indexPath = path.join(ADMIN_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('Admin index.html not found.');
  process.exit(1);
}

let indexContent = fs.readFileSync(indexPath, 'utf8');

// Replace any absolute paths with the base path
indexContent = indexContent.replace(/src="\/(?!\/)/g, `src="${BASE_PATH}/`);
indexContent = indexContent.replace(/href="\/(?!\/)/g, `href="${BASE_PATH}/`);

// Add a base tag to ensure all relative paths work correctly
indexContent = indexContent.replace(/<head>/, `<head>\n  <base href="${BASE_PATH}/admin/">`);

// Add a meta tag for Tina CMS to find the correct base path
indexContent = indexContent.replace(/<head>/, `<head>\n  <meta name="tinacms-site-base-path" content="${BASE_PATH}">`);

// Write the updated content back to the file
fs.writeFileSync(indexPath, indexContent);

console.log('✅ Admin paths fixed successfully.'); 