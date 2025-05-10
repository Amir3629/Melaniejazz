# Simple PowerShell script to deploy the site to GitHub Pages

# Ensure the output directory exists
if (-not (Test-Path -Path "out")) {
    Write-Host "Output directory 'out' not found. Run 'npm run build' first."
    exit 1
}

# Create repository configuration in the output directory
$repoConfig = @"
[core]
repositoryformatversion = 0
filemode = false
bare = false
logallrefupdates = true
symlinks = false
ignorecase = true
[remote "origin"]
url = https://github.com/Amir3629/Melaniejazz.git
fetch = +refs/heads/*:refs/remotes/origin/*
[branch "gh-pages"]
remote = origin
merge = refs/heads/gh-pages
"@

# Create .git directory and config
$gitDir = "out/.git"
if (-not (Test-Path -Path $gitDir)) {
    New-Item -ItemType Directory -Path $gitDir | Out-Null
}
Set-Content -Path "$gitDir/config" -Value $repoConfig

# Create .nojekyll file (needed for GitHub Pages)
$nojekyll = "out/.nojekyll"
if (-not (Test-Path -Path $nojekyll)) {
    New-Item -ItemType File -Path $nojekyll | Out-Null
}

# Change to the output directory
Set-Location -Path "out"

# Initialize git in the output directory if not already initialized
if (-not (Test-Path -Path ".git/HEAD")) {
    git init
}

# Commit all files and push to gh-pages branch
git add -A
git commit -m "Deploy to GitHub Pages"
git push -f origin HEAD:gh-pages

# Return to the original directory
Set-Location -Path ".."

Write-Host "Deployment completed." 