Write-Host "Creating .nojekyll file..." -ForegroundColor Green
$null > out/.nojekyll

Write-Host "Copying public assets to out directory..." -ForegroundColor Green
xcopy /E /I /Y public\* out\

Write-Host "Deploying to GitHub Pages..." -ForegroundColor Green
npx push-dir --dir=out --branch=gh-pages --cleanup

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Your site should be available soon at: https://yourusername.github.io/Melaniejazz" -ForegroundColor Cyan
Write-Host "Remember to check your GitHub repository settings to ensure GitHub Pages is enabled." -ForegroundColor Yellow 