const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function runBuild() {
  try {
    execSync("npm run build", { stdio: "inherit" });
    console.log("\n✅ Build succeeded!");
    process.exit(0);
  } catch (error) {
    console.log("\n❌ Build failed. Attempting to fix...\n");
    fixSuspenseErrors();
  }
}

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

  runBuild(); // Retry build after fixing
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

runBuild(); 