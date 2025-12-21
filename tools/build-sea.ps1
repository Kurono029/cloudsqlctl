$ErrorActionPreference = "Stop"

# Ensure dist directory exists
if (-not (Test-Path "dist")) {
    New-Item -ItemType Directory -Path "dist" | Out-Null
}

# Ensure bin directory exists
if (-not (Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}

# 1. Build the project (already done by npm run build, but ensuring here)
# We assume npm run build has been called or we call it.
# Write-Host "Building project..."
# npm run build

# 2. Create sea-config.json
$seaConfig = @{
    main                          = "dist/cli.cjs"
    output                        = "dist/sea-prep.blob"
    disableExperimentalSEAWarning = $true
    useCodeCache                  = $true
}
$seaConfig | ConvertTo-Json | Set-Content "dist/sea-config.json"

# 3. Generate blob
Write-Host "Generating SEA blob..."
node --experimental-sea-config dist/sea-config.json

# 4. Copy node.exe
Write-Host "Copying node.exe..."
Copy-Item (Get-Command node).Source "dist/cloudsqlctl-base.exe"

# 5. Set Icon/Metadata (Before injection to avoid rcedit issues with SEA blobs)
Write-Host "Setting icon and metadata..."
node tools/set-icon.mjs "dist/cloudsqlctl-base.exe"

# 6. Inject blob
Write-Host "Injecting blob..."
npx postject dist/cloudsqlctl-base.exe NODE_SEA_BLOB dist/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

# 7. Move to bin
Write-Host "Finalizing..."
Move-Item -Path "dist/cloudsqlctl-base.exe" -Destination "bin/cloudsqlctl.exe" -Force

# 8. Sign Executable (Optional)
Write-Host "Attempting to sign executable..."
./tools/sign-exe.ps1

Write-Host "Build complete: bin/cloudsqlctl.exe"
