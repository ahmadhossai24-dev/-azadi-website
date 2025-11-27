#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Current working directory:', process.cwd());
console.log('Files in current directory:');
execSync('ls -la', { stdio: 'inherit' });

// Check if we're in a /src subdirectory created by Render
if (!fs.existsSync('client') && fs.existsSync('../client')) {
  console.log('Detected /src subdirectory, moving up...');
  process.chdir('..');
  console.log('New working directory:', process.cwd());
}

console.log('Building from:', process.cwd());
console.log('Files here:');
execSync('ls -la', { stdio: 'inherit' });

// Run the build
console.log('\nRunning npm run build...');
execSync('npm run build', { stdio: 'inherit' });
