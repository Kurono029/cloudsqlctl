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
Write-Warning "DEPRECATED: Please use 'cloudsqlctl service install' instead."
exit 1
`,
    'uninstall-proxy.ps1': `
Write-Warning "DEPRECATED: Please use 'cloudsqlctl service remove' instead."
$service = Get-Service -Name "${SERVICE_NAME}" -ErrorAction SilentlyContinue
if ($service) {
    Stop-Service -Name "${SERVICE_NAME}" -Force -ErrorAction SilentlyContinue
    sc.exe delete "${SERVICE_NAME}"
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

