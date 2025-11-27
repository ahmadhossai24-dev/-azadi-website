#!/bin/bash
set -e

echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

echo "Listing client/src/pages:"
ls -la client/src/pages/ | head -10

echo "Starting build..."
npm run build
