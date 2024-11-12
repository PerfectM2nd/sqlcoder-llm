import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure which directories and files to ignore
const ignoreDirs = ['node_modules', 'dist', '.git'];

const ignoreFiles = [
  '.DS_Store',
  '.env',
  'yarn.lock',
  'generate-codebase-context.js',
  'Makefile',
  'README.md',
  'tsconfig.json',
  'tsconfig.build.json',
  '.eslintrc.js',
  '.gitignore',
  '.prettierrc',
];

// Function to check if a path should be ignored
function shouldIgnore(pathName) {
  const baseName = path.basename(pathName);
  if (ignoreFiles.includes(baseName)) return true;

  // Check if path contains any ignored directory
  return ignoreDirs.some(
    (dir) => pathName.includes('/' + dir + '/') || pathName.endsWith('/' + dir),
  );
}

// Function to generate directory tree
function generateTree(dir, prefix = '') {
  const items = fs.readdirSync(dir);
  let tree = '';

  items.forEach((item, index) => {
    const itemPath = path.join(dir, item);

    if (shouldIgnore(itemPath)) return;

    const isLast = index === items.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const newPrefix = prefix + (isLast ? '    ' : '│   ');

    tree += prefix + connector + item + '\n';

    if (fs.statSync(itemPath).isDirectory()) {
      tree += generateTree(itemPath, newPrefix);
    }
  });

  return tree;
}

// Function to gather all files recursively
function gatherFiles(dir, filesList = []) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const itemPath = path.join(dir, item);

    if (shouldIgnore(itemPath)) return;

    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      gatherFiles(itemPath, filesList);
    } else {
      filesList.push(itemPath);
    }
  });

  return filesList;
}

// Main function
function generateCodebaseContext() {
  // Get current directory
  const __filename = fileURLToPath(import.meta.url);
  const rootDir = path.dirname(__filename);
  const outputFile = path.join(rootDir, 'codebase-context.txt');

  // Generate tree structure
  const tree = 'general folder and files tree\n\n' + generateTree(rootDir);

  // Gather all files
  const files = gatherFiles(rootDir);

  // Initialize output with the tree
  let output = tree + '\n\n';

  // Process each file
  files.forEach((filePath) => {
    const relativePath = path.relative(rootDir, filePath);

    try {
      // Check file size before reading (skip large files)
      const stats = fs.statSync(filePath);
      if (stats.size > 1024 * 1024) {
        // Skip files larger than 1MB
        output += `${relativePath}:\nFile too large, skipped (${Math.round(stats.size / 1024)}KB)\n-------------\n\n`;
        return;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      output += `${relativePath}:\n${content}\n-------------\n\n`;
    } catch (err) {
      output += `${relativePath}:\nError reading file: ${err.message}\n-------------\n\n`;
    }
  });

  // Write to output file
  fs.writeFileSync(outputFile, output);
  console.log(`Codebase context has been written to ${outputFile}`);
}

// Run the function
generateCodebaseContext();
