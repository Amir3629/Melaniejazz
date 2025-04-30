const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Fix incorrect if conditions with arrow syntax
    let fixedContent = content.replace(
      /if\s*\((.*?)\)\s*=>\s*{/g, 
      (match, condition) => {
        changed = true;
        return `if (${condition}) {`;
      }
    );
    
    // Fix function definitions without arrow syntax
    fixedContent = fixedContent.replace(
      /const\s+(\w+)\s*=\s*\(\)\s*{(?!\s*=>)/g,
      (match, funcName) => {
        changed = true;
        return `const ${funcName} = () => {`;
      }
    );
    
    // Fix remaining return callbacks with arrow syntax issues
    fixedContent = fixedContent.replace(
      /return\s*\(\)\s*=>\s*{([\s\S]*?)if\s*\((.*?)\)\s*=>\s*{/g,
      (match, returnBody, condition) => {
        changed = true;
        return `return () => {${returnBody}if (${condition}) {`;
      }
    );
    
    if (changed) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed arrow functions in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

// Start processing from the app directory
console.log('Starting to fix arrow function syntax...');
processDirectory('./app');
console.log('✅ All files processed!'); 