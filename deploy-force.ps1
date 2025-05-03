# PowerShell script to deploy to Melaniejazz gh-pages branch

Write-Host "Starting deployment to Melaniejazz repository's gh-pages branch..."

# Create a temporary directory
$tempDir = "temp-deploy-$(Get-Random)"
Write-Host "Creating temporary directory: $tempDir"
New-Item -ItemType Directory -Path $tempDir | Out-Null

try {
    # Clone just the gh-pages branch
    Write-Host "Cloning gh-pages branch from Melaniejazz repository..."
    git clone --single-branch --branch gh-pages https://github.com/Amir3629/Melaniejazz.git $tempDir
    
    # If the clone failed because the branch doesn't exist yet, create an empty repository
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Branch doesn't exist yet, creating empty repository..."
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        Set-Location $tempDir
        git init
        git checkout -b gh-pages
    }
    else {
        Set-Location $tempDir
        # Clean existing content except .git directory
        Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
    }
    
    # Copy the content from the out directory
    Write-Host "Copying content from out directory..."
    Copy-Item -Path "../out/*" -Destination . -Recurse
    
    # Create .nojekyll file (needed for GitHub Pages with Next.js)
    Write-Host "Creating .nojekyll file..."
    New-Item -ItemType File -Path ".nojekyll" -Force | Out-Null
    
    # Stage all files
    Write-Host "Staging files..."
    git add -A
    
    # Commit changes
    Write-Host "Committing changes..."
    git commit -m "Deploy to GitHub Pages"
    
    # Push to gh-pages branch
    Write-Host "Pushing to gh-pages branch..."
    git push -u https://github.com/Amir3629/Melaniejazz.git gh-pages
    
    Write-Host "Deployment successful!"
}
catch {
    Write-Host "An error occurred: $_"
}
finally {
    # Return to original directory
    Set-Location ..
    
    # Clean up temporary directory
    Write-Host "Cleaning up temporary directory..."
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
} 