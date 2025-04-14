/**
 * Image Optimization Script for Mel Jazz website
 * 
 * This script will:
 * 1. Convert images to WebP format for better compression
 * 2. Resize large images to appropriate dimensions
 * 3. Compress images to reduce file size
 * 4. Create responsive image variants
 * 
 * Usage: 
 * 1. Install required packages: npm install sharp glob fs-extra
 * 2. Run: node optimize-images.js
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const sharp = require('sharp');

// Configuration
const config = {
  // Directories to scan for images
  sourceDirs: [
    './public/images',
    './public/backgrounds',
    './public/gallery',
  ],
  // Output directory for optimized images
  outputDir: './public/optimized',
  // Image extensions to process
  extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  // Sizes for responsive images
  sizes: [640, 750, 960, 1280, 1920],
  // Quality settings
  quality: {
    webp: 80,
    jpeg: 80,
    png: 80
  },
  // Skip already optimized images
  skipExisting: true,
  // Resize large images that exceed these dimensions
  maxDimensions: {
    width: 1920,
    height: 1080
  }
};

// Create output directory if it doesn't exist
fs.ensureDirSync(config.outputDir);

// Process each source directory
async function processDirectories() {
  for (const sourceDir of config.sourceDirs) {
    if (!fs.existsSync(sourceDir)) {
      console.log(`Directory not found: ${sourceDir}`);
      continue;
    }

    const images = glob.sync(`${sourceDir}/**/*+(${config.extensions.join('|')})`);
    console.log(`Found ${images.length} images in ${sourceDir}`);
    
    for (const imagePath of images) {
      await processImage(imagePath);
    }
  }
}

// Process a single image
async function processImage(imagePath) {
  try {
    const filename = path.basename(imagePath);
    const relativePath = path.relative(path.dirname(config.sourceDirs[0]), path.dirname(imagePath));
    const outputPath = path.join(config.outputDir, relativePath);
    
    // Create output directory
    fs.ensureDirSync(outputPath);
    
    // Get image metadata
    const metadata = await sharp(imagePath).metadata();
    
    // Skip SVG files (they're already optimal)
    if (metadata.format === 'svg') {
      console.log(`Skipping SVG: ${imagePath}`);
      return;
    }
    
    // Skip small images that don't need responsive variants
    const needsResponsive = metadata.width > 640 || metadata.height > 640;
    
    // Determine if image needs resizing
    const needsResize = metadata.width > config.maxDimensions.width || 
                        metadata.height > config.maxDimensions.height;

    // Base image processing
    let image = sharp(imagePath);
    
    // Resize if needed
    if (needsResize) {
      image = image.resize({
        width: Math.min(metadata.width, config.maxDimensions.width),
        height: Math.min(metadata.height, config.maxDimensions.height),
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Create WebP version
    const webpName = path.join(outputPath, filename.replace(path.extname(filename), '.webp'));
    if (!fs.existsSync(webpName) || !config.skipExisting) {
      await image.webp({ quality: config.quality.webp }).toFile(webpName);
      console.log(`Created WebP: ${webpName}`);
    }
    
    // Create optimized original format
    const optimizedName = path.join(outputPath, filename);
    if (!fs.existsSync(optimizedName) || !config.skipExisting) {
      if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
        await image.jpeg({ quality: config.quality.jpeg, progressive: true }).toFile(optimizedName);
      } else if (metadata.format === 'png') {
        await image.png({ quality: config.quality.png, compressionLevel: 9 }).toFile(optimizedName);
      } else {
        await image.toFile(optimizedName);
      }
      console.log(`Optimized: ${optimizedName}`);
    }
    
    // Create responsive variants if needed
    if (needsResponsive) {
      for (const size of config.sizes) {
        // Skip sizes larger than the original
        if (size >= metadata.width) continue;
        
        const resizeRatio = size / metadata.width;
        const height = Math.round(metadata.height * resizeRatio);
        
        // Responsive WebP
        const responsiveWebpName = path.join(
          outputPath, 
          filename.replace(path.extname(filename), `-${size}.webp`)
        );
        
        if (!fs.existsSync(responsiveWebpName) || !config.skipExisting) {
          await sharp(imagePath)
            .resize(size, height)
            .webp({ quality: config.quality.webp })
            .toFile(responsiveWebpName);
          console.log(`Created responsive WebP (${size}px): ${responsiveWebpName}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

// Special treatment for critical performance affecting images
async function optimizeCriticalImages() {
  const criticalImages = [
    './public/backgrounds/hero-bg.jpg',
    './public/backgrounds/services-bg.jpg',
    './public/123.png'
  ];
  
  for (const imagePath of criticalImages) {
    if (!fs.existsSync(imagePath)) {
      console.log(`Critical image not found: ${imagePath}`);
      continue;
    }
    
    try {
      const filename = path.basename(imagePath);
      const outputPath = path.join(config.outputDir, 'critical');
      
      // Create output directory
      fs.ensureDirSync(outputPath);
      
      // Extra optimization for hero images
      await sharp(imagePath)
        .resize({
          width: 1280,
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 75, effort: 6 })
        .toFile(path.join(outputPath, filename.replace(path.extname(filename), '.webp')));
      
      console.log(`Optimized critical image: ${imagePath}`);
      
      // Create low-quality placeholder
      await sharp(imagePath)
        .resize({ width: 20 })
        .blur(5)
        .webp({ quality: 20 })
        .toFile(path.join(outputPath, filename.replace(path.extname(filename), '-placeholder.webp')));
      
      console.log(`Created placeholder for: ${imagePath}`);
    } catch (error) {
      console.error(`Error optimizing critical image ${imagePath}:`, error);
    }
  }
}

// Generate instructions file
function generateInstructions() {
  const instructions = `
# Image Optimization Results

The optimized images have been saved to: ${config.outputDir}

## Next Steps:

1. Replace the original images with the optimized versions
2. Update the 'next.config.js' to ensure the optimized images are used
3. Use the Next.js Image component with proper sizes and quality settings
4. For critical images, use the optimized versions in the 'critical' folder

## Performance Tips:

- Use WebP images with fallback to original format
- Lazy load images below the fold
- Specify the 'sizes' attribute for responsive images
- Preload critical images in the head section
`;

  fs.writeFileSync(path.join(config.outputDir, 'INSTRUCTIONS.md'), instructions);
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  await processDirectories();
  await optimizeCriticalImages();
  generateInstructions();
  console.log('Image optimization complete! Check the output at:', config.outputDir);
}

main().catch(error => {
  console.error('An error occurred:', error);
}); 