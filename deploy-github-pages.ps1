Write-Host "Building site with Tina CMS..." -ForegroundColor Green
npm run build:tina

Write-Host "Creating .nojekyll file..." -ForegroundColor Green
$null > out/.nojekyll

Write-Host "Copying additional assets..." -ForegroundColor Green
xcopy /E /I /Y public\* out\

Write-Host "Deploying to GitHub Pages..." -ForegroundColor Green
npx push-dir --dir=out --branch=gh-pages --cleanup

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Your site should be available at: https://yourusername.github.io/Melaniejazz" -ForegroundColor Cyan 