// Simple script to check images for deployment
const fs = require('fs');
const path = require('path');

console.log('Checking images for deployment...');

// Check if public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  console.error('Public directory not found!');
  process.exit(1);
}

// Check if images directory exists
const imagesDir = path.join(publicDir, 'images');
if (!fs.existsSync(imagesDir)) {
  console.log('Creating images directory...');
  fs.mkdirSync(imagesDir, { recursive: true });
}

console.log('Images check completed successfully.'); 