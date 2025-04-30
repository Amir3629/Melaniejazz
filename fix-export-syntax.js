const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    console.log(`Fixing file: ${filePath}`);
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has the problematic pattern
    if (!content.includes('export default const')) {
      return;
    }
    
    // Replace the incorrect syntax
    let fixedContent = content;
    
    // Fix "export default const Component = () {"
    fixedContent = fixedContent.replace(/export default const (\w+) = \(\) {/g, 'const $1 = () => {');
    
    // Fix "export default const Component = (props) {"
    fixedContent = fixedContent.replace(/export default const (\w+) = \((.*?)\) {/g, 'const $1 = ($2) => {');
    
    // Fix "export default const Component = (\n  props\n) {"
    fixedContent = fixedContent.replace(/export default const (\w+) = \([\s\S]*?\) {/g, (match, componentName) => {
      // Extract the props part
      const propsPart = match.substring(
        match.indexOf('(') + 1,
        match.lastIndexOf(') {')
      );
      return `const ${componentName} = (${propsPart}) => {`;
    });
    
    // Fix "const Component = () {" to "const Component = () => {"
    fixedContent = fixedContent.replace(/const (\w+) = \(\) {/g, 'const $1 = () => {');
    
    // Fix multiline function declarations
    fixedContent = fixedContent.replace(/const (\w+) = \([\s\S]*?\) {(?!\s*=>)/g, (match, componentName) => {
      // Extract the props part
      const propsPart = match.substring(
        match.indexOf('(') + 1,
        match.lastIndexOf(') {')
      );
      return `const ${componentName} = (${propsPart}) => {`;
    });
    
    // Add export default at the end if missing
    const componentNameMatch = content.match(/export default const (\w+)/);
    if (componentNameMatch) {
      const componentName = componentNameMatch[1];
      if (!fixedContent.includes(`export default ${componentName}`)) {
        fixedContent = fixedContent + `\n\nexport default ${componentName};\n`;
      }
    }
    
    // Write the fixed content back
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    
    console.log(`✅ Fixed: ${filePath}`);
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
console.log('Starting to fix export syntax...');
processDirectory('./app');
console.log('✅ All files processed!'); 