# Direct deployment script with verbose output

Write-Host "Starting direct deployment to GitHub Pages..." -ForegroundColor Green

# Ensure build directory exists
if (-not (Test-Path -Path "out")) {
    Write-Host "ERROR: The 'out' directory doesn't exist. Run 'npm run build' first." -ForegroundColor Red
    exit 1
}

# Navigate to the build directory
Write-Host "Changing to the output directory..." -ForegroundColor Yellow
Set-Location out

# Add .nojekyll file
Write-Host "Adding .nojekyll file..." -ForegroundColor Yellow
New-Item -ItemType File -Path ".nojekyll" -Force | Out-Null

# Setup git in the output directory
Write-Host "Setting up git in the output directory..." -ForegroundColor Yellow
git init

# Add the Melaniejazz repository as remote
Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/Amir3629/Melaniejazz.git

# Create branch
Write-Host "Creating the gh-pages branch..." -ForegroundColor Yellow
git checkout -b gh-pages

# Stage all files
Write-Host "Staging all files..." -ForegroundColor Yellow
git add .

# Commit the changes
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Deploy to GitHub Pages"

# Push to GitHub with force (overwrite any existing gh-pages branch)
Write-Host "Pushing to GitHub Pages (gh-pages branch)..." -ForegroundColor Yellow
git push -f origin gh-pages

# Go back to the project root
Write-Host "Returning to project root..." -ForegroundColor Yellow
Set-Location ..

Write-Host "Deployment completed." -ForegroundColor Green 