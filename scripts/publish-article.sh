#!/bin/bash

# Publish article to production
echo "Publishing article to Singapore Property Hub..."

# Read the article data
ARTICLE_DATA=$(cat scripts/article-to-publish.json)

# Make the POST request
curl -X POST https://singapore-property-hub.vercel.app/api/articles \
  -H "Content-Type: application/json" \
  -d "$ARTICLE_DATA" \
  -w "\n\nHTTP Status: %{http_code}\n"

echo "\nArticle publication complete!"
echo "View your article at: https://singapore-property-hub.vercel.app/articles/singapore-property-market-outlook-2025"