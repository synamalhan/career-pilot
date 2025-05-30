#!/bin/bash

# Exit immediately on error
set -e

echo "➡️  Adding all changes..."
git add .

echo "📝 Enter commit message:"
read COMMIT_MESSAGE

git commit -m "$COMMIT_MESSAGE"
echo "📤 Pushing to GitHub..."
git push origin main