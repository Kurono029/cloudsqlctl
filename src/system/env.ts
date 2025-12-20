import { runPs, isAdmin } from './powershell.js';
import { SYSTEM_PATHS, ENV_VARS } from './paths.js';
import { logger } from '../core/logger.js';

export async function setSystemEnv(name: string, value: string) {
    if (!await isAdmin()) {
        throw new Error('Admin privileges required to set system environment variables.');
    }
    logger.info(`Setting system environment variable: ${name}=${value}`);
    await runPs(`[Environment]::SetEnvironmentVariable("${name}", "${value}", "Machine")`);
}

export async function setupEnvironment() {
    logger.info('Configuring system environment variables...');

    await setSystemEnv(ENV_VARS.HOME, SYSTEM_PATHS.HOME);
    await setSystemEnv(ENV_VARS.LOGS, SYSTEM_PATHS.LOGS);
    await setSystemEnv(ENV_VARS.PROXY_PATH, SYSTEM_PATHS.PROXY_EXE);

    // We don't overwrite GOOGLE_APPLICATION_CREDENTIALS if it exists, but we could ensure it points to a standard location if needed.
    // For now, we'll leave it as user-managed or set it if missing and we have a default.
}

export async function checkEnvironment(): Promise<boolean> {
    const home = await runPs(`[Environment]::GetEnvironmentVariable("${ENV_VARS.HOME}", "Machine")`);
    const logs = await runPs(`[Environment]::GetEnvironmentVariable("${ENV_VARS.LOGS}", "Machine")`);
    const proxy = await runPs(`[Environment]::GetEnvironmentVariable("${ENV_VARS.PROXY_PATH}", "Machine")`);

    return home === SYSTEM_PATHS.HOME &&
        logs === SYSTEM_PATHS.LOGS &&
        proxy === SYSTEM_PATHS.PROXY_EXE;
}
