@echo off
echo Publishing article to Singapore Property Hub...

cd scripts
node publish-first-article.js

echo.
echo To publish the article, run this PowerShell command:
echo.
echo $articleData = Get-Content -Path "article-to-publish.json" -Raw
echo Invoke-RestMethod -Uri "https://singapore-property-hub.vercel.app/api/articles" -Method Post -Body $articleData -ContentType "application/json"
echo.
echo Or use curl if you have it installed:
echo curl -X POST https://singapore-property-hub.vercel.app/api/articles -H "Content-Type: application/json" -d @article-to-publish.json
echo.
echo After publishing, view your article at:
echo https://singapore-property-hub.vercel.app/articles/singapore-property-market-outlook-2025
pause