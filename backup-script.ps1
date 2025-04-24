# Set error action preference to stop on any error
$ErrorActionPreference = "Stop"

# Create timestamp for backup directory name
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "..\backup-temp\backup_$timestamp"

# Create backup directory
Write-Host "Creating backup directory: $backupDir"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Define array of important files and directories to backup
$itemsToBackup = @(
    "app",
    "components",
    "pages",
    "public",
    "styles",
    "package.json",
    "next.config.js",
    ".env",
    ".env.local",
    "tailwind.config.js"
)

# Loop through each item and backup
foreach ($item in $itemsToBackup) {
    if (Test-Path $item) {
        $itemInfo = Get-Item $item
        if ($itemInfo.PSIsContainer) {
            Write-Host "Backing up directory: $item"
            Copy-Item -Path $item -Destination "$backupDir\$item" -Recurse -Force
        } else {
            Write-Host "Backing up file: $item"
            Copy-Item -Path $item -Destination "$backupDir\$item" -Force
        }
    } else {
        Write-Host "Warning: $item not found, skipping..."
    }
}

Write-Host "`nBackup completed successfully to: $backupDir" 