#!/bin/bash

# IWASP iOS Deploy Script
# Usage: ./deploy.sh or bash deploy.sh

echo "🚀 IWASP Deploy - Build & Sync iOS"
echo "=================================="

# Step 1: Build
echo "📦 Building web app..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build complete"

# Step 2: Sync iOS
echo "📱 Syncing with iOS..."
npx cap sync ios

if [ $? -ne 0 ]; then
  echo "❌ iOS sync failed!"
  exit 1
fi

echo "✅ iOS sync complete"

# Step 3: Open Xcode (optional)
echo ""
read -p "🔧 Open Xcode? (y/n): " open_xcode

if [ "$open_xcode" = "y" ] || [ "$open_xcode" = "Y" ]; then
  npx cap open ios
fi

echo ""
echo "🎉 Deploy complete! Your app is ready."
