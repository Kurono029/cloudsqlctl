param(
    [string]$ExePath = "bin\cloudsqlctl.exe",
    [string]$CertPath = "$env:CLOUDSQLCTL_SIGN_CERT",
    [string]$CertPassword = "$env:CLOUDSQLCTL_SIGN_PWD"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ExePath)) {
    Write-Warning "Executable not found at $ExePath. Skipping signing."
    exit 0
}

if (-not $CertPath -or -not (Test-Path $CertPath)) {
    Write-Warning "Signing certificate not found (env:CLOUDSQLCTL_SIGN_CERT). Skipping digital signature."
    Write-Host "To enable signing, set CLOUDSQLCTL_SIGN_CERT to the path of your .pfx file."
    exit 0
}

Write-Host "Signing $ExePath with certificate $CertPath..."

try {
    if ($CertPassword) {
        $securePass = ConvertTo-SecureString -String $CertPassword -AsPlainText -Force
        $cert = Get-PfxCertificate -FilePath $CertPath -Password $securePass
    }
    else {
        $cert = Get-PfxCertificate -FilePath $CertPath
    }
    
    Set-AuthenticodeSignature -FilePath $ExePath -Certificate $cert -TimestampServer "http://timestamp.digicert.com"
    Write-Host "Successfully signed $ExePath"
}
catch {
    Write-Error "Failed to sign executable: $_"
    exit 1
}
