const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Auto-fixes common build issues in Next.js projects
 * 
 * 1. Adds "use client" directive to files using client-side hooks
 * 2. Checks for proper component exports to avoid "f is not a function" errors
 * 3. Adds React import to client components
 */

// Directories to scan
const DIRS_TO_SCAN = ['app', 'pages', 'components'];

// Function patterns to look for
const CLIENT_HOOKS = [
  'useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 
  'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 
  'useDebugValue', 'useSearchParams', 'useRouter', 'usePathname'
];

function fixSuspenseErrors() {
  const targetDirs = [
    "app",
    "app/legal",
    "app/booking",
    "app/payment/[orderId]"
  ];

  targetDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) return;
    fs.readdirSync(fullPath).forEach(file => {
      const filePath = path.join(fullPath, file, "page.tsx");
      if (!fs.existsSync(filePath)) return;

      let content = fs.readFileSync(filePath, "utf8");

      if (
        content.includes("useSearchParams") &&
        !content.includes("Suspense")
      ) {
        const updated = wrapInSuspense(content);
        fs.writeFileSync(filePath, updated, "utf8");
        console.log(`✅ Updated: ${filePath}`);
      }
    });
  });
}

function wrapInSuspense(content) {
  if (!content.includes("Suspense")) {
    content = `import { Suspense } from 'react'\n` + content;
  }

  const match = content.match(/export default function (\w+)\(\)/);
  if (!match) return content;
  const componentName = match[1];

  return content.replace(
    new RegExp(`export default function ${componentName}\\(\\) {([\\s\\S]*?)return \\(`),
    `export default function ${componentName}() {\n  return (\n    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>\n`
  ).replace(/<\/div>\s*\)$/, "</div></Suspense>)");
}

// Convert a function component to an arrow function component
function convertToArrowFunction(content) {
  // Match function components
  const functionRegex = /function\s+([A-Za-z0-9_]+)\s*\(/g;
  return content.replace(functionRegex, 'const $1 = (');
}

// Ensure proper default export syntax
function fixDefaultExport(content, componentName) {
  // If there's an export default function, convert it
  if (content.includes(`export default function ${componentName}`)) {
    content = content.replace(
      `export default function ${componentName}`, 
      `const ${componentName} = `
    );
    
    // Add the export statement at the end if missing
    if (!content.includes(`export default ${componentName}`)) {
      content += `\n\nexport default ${componentName}`;
    }
  }
  
  return content;
}

// Add React import if missing
function ensureReactImport(content) {
  if (!content.includes("import React")) {
    // If there are other imports, add after the first import
    if (content.includes("import ")) {
      const importEndIndex = content.indexOf("import ") + content.slice(content.indexOf("import ")).indexOf("\n") + 1;
      return content.slice(0, importEndIndex) + "import React from 'react'\n" + content.slice(importEndIndex);
    } else {
      // Otherwise add at the beginning
      return "import React from 'react'\n" + content;
    }
  }
  return content;
}

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, path.extname(filePath));
    let changed = false;
    
    // Check if this is a client component (has hooks or uses browser APIs)
    const isClientComponent = CLIENT_HOOKS.some(hook => content.includes(hook)) || 
                             content.includes('window.') ||
                             content.includes('document.');
    
    // Add 'use client' if this is a client component and missing the directive
    if (isClientComponent && !content.includes('"use client"') && !content.includes("'use client'")) {
      content = '"use client"\n\n' + content;
      changed = true;
    }
    
    // Fix function components to arrow functions to avoid "f is not a function" error
    if (isClientComponent) {
      const newContent = convertToArrowFunction(content);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
      
      // Fix default export
      const fixedExport = fixDefaultExport(content, fileName);
      if (fixedExport !== content) {
        content = fixedExport;
        changed = true;
      }
      
      // Add React import
      const withReactImport = ensureReactImport(content);
      if (withReactImport !== content) {
        content = withReactImport;
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Process directories recursively
function processDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js')) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

// Start processing
console.log('Starting auto-build fix...');

// Fix Suspense errors first
fixSuspenseErrors();

// Process all components to fix common issues
DIRS_TO_SCAN.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
});

console.log('Auto-build fix completed!'); 