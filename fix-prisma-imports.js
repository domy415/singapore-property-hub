const fs = require('fs');
const path = require('path');

// Find all TypeScript files in src/app/api
function findApiFiles(dir) {
  const files = [];
  
  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith('.ts') && fullPath.includes('/api/')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDir(dir);
  return files;
}

// Fix Prisma imports in a file
function fixPrismaImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Check if file has top-level Prisma import
    if (content.includes("import { prisma } from '@/lib/prisma'")) {
      console.log(`Fixing ${filePath}...`);
      
      // Remove the top-level import
      content = content.replace("import { prisma } from '@/lib/prisma'\n", '');
      content = content.replace("import { prisma } from '@/lib/prisma'", '');
      
      // Find function bodies and add dynamic imports
      const functionRegex = /(export\s+async\s+function\s+(?:GET|POST|PUT|DELETE|PATCH)\s*\([^)]*\)\s*{)/g;
      
      content = content.replace(functionRegex, (match) => {
        return match + '\n    // Dynamic import to avoid build-time initialization\n    const { prisma } = await import(\'@/lib/prisma\')\n';
      });
      
      hasChanges = true;
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
const srcDir = './src';
const apiFiles = findApiFiles(srcDir);

console.log(`Found ${apiFiles.length} API files to check...`);

let fixedCount = 0;
for (const file of apiFiles) {
  if (fixPrismaImports(file)) {
    fixedCount++;
  }
}

console.log(`\n🎉 Fixed ${fixedCount} files with Prisma import issues`);