#!/bin/bash
set -e

echo "=== Running post-start setup ==="

# Ensure dependencies are up to date
if [ -f "package-lock.json" ]; then
    echo "Checking for dependency updates..."
    npm install --prefer-offline
fi

echo "=== Post-start setup complete ==="
echo "Run 'npm run dev' to start the development server"
