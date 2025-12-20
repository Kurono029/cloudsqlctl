import fs from 'fs-extra';
import path from 'path';
import { SYSTEM_PATHS, ENV_VARS, SERVICE_NAME } from './paths.js';
import { logger } from '../core/logger.js';

const SCRIPTS = {
    'setenv.ps1': `
[Environment]::SetEnvironmentVariable("${ENV_VARS.HOME}", "${SYSTEM_PATHS.HOME}", "Machine")
[Environment]::SetEnvironmentVariable("${ENV_VARS.LOGS}", "${SYSTEM_PATHS.LOGS}", "Machine")
[Environment]::SetEnvironmentVariable("${ENV_VARS.PROXY_PATH}", "${SYSTEM_PATHS.PROXY_EXE}", "Machine")
Write-Host "Environment variables set."
`,
    'install-proxy.ps1': `
param([string]$ProxyPath = "${SYSTEM_PATHS.PROXY_EXE}")

if (!(Test-Path $ProxyPath)) {
    Write-Error "Proxy binary not found at $ProxyPath"
    exit 1
}

$service = Get-Service -Name "${SERVICE_NAME}" -ErrorAction SilentlyContinue
if ($service) {
    Write-Host "Service ${SERVICE_NAME} already exists."
} else {
    New-Service -Name "${SERVICE_NAME}" -BinaryPathName $ProxyPath -StartupType Automatic
    Write-Host "Service ${SERVICE_NAME} installed."
}
`,
    'uninstall-proxy.ps1': `
$service = Get-Service -Name "${SERVICE_NAME}" -ErrorAction SilentlyContinue
if ($service) {
    Stop-Service -Name "${SERVICE_NAME}" -Force -ErrorAction SilentlyContinue
    Remove-Service -Name "${SERVICE_NAME}" -ErrorAction SilentlyContinue
    Write-Host "Service ${SERVICE_NAME} removed."
}
`,
    'update-proxy.ps1': `
# Placeholder for update logic
Write-Host "Update logic to be implemented via CLI"
`
};

export async function generateScripts() {
    await fs.ensureDir(SYSTEM_PATHS.SCRIPTS);

    for (const [name, content] of Object.entries(SCRIPTS)) {
        const filePath = path.join(SYSTEM_PATHS.SCRIPTS, name);
        await fs.writeFile(filePath, content.trim());
        logger.info(`Generated script: ${filePath}`);
    }
}
