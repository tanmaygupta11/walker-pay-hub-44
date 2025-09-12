#!/bin/bash
# Simple sync script to pull latest changes

echo "🔄 Syncing with remote repository..."
git fetch origin
git pull origin main

if [ $? -eq 0 ]; then
    echo "✅ Sync completed successfully!"
else
    echo "❌ Sync failed. Please check for conflicts."
fi
