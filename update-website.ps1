Write-Host "Building the site with fixed components..." -ForegroundColor Green
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build

Write-Host "Creating .nojekyll file..." -ForegroundColor Green
$null > out/.nojekyll

Write-Host "Copying assets to the output directory..." -ForegroundColor Green
xcopy /E /I /Y public\* out\

Write-Host "Deploying to GitHub Pages..." -ForegroundColor Green
npx push-dir --dir=out --branch=gh-pages --cleanup --force

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Your site should be available soon at: https://amir3629.github.io/Melaniejazz" -ForegroundColor Cyan
Write-Host "TinaCMS admin should be available at: https://amir3629.github.io/Melaniejazz/admin" -ForegroundColor Cyan
Write-Host "Remember to check your browser's console if you encounter any issues" -ForegroundColor Yellow 