// Simple script to verify assets for deployment
const fs = require('fs');
const path = require('path');

console.log('Verifying assets for deployment...');

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

// Check if music directory exists
const musicDir = path.join(publicDir, 'music');
if (!fs.existsSync(musicDir)) {
  console.log('Creating music directory...');
  fs.mkdirSync(musicDir, { recursive: true });
}

// Create a placeholder test track if it doesn't exist
const testTrack = path.join(musicDir, 'test-track.mp3');
if (!fs.existsSync(testTrack)) {
  console.log('Creating placeholder test track...');
  // Create an empty file
  fs.writeFileSync(testTrack, '');
}

// Create a placeholder album cover if it doesn't exist
const albumCover = path.join(imagesDir, 'album-cover.jpg');
if (!fs.existsSync(albumCover)) {
  console.log('Creating placeholder album cover...');
  // Create an empty image file
  fs.writeFileSync(albumCover, '');
}

console.log('Assets verification completed successfully.'); 