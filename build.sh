#!/bin/bash
set -e

echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

npm install --production=false
npm run build
