import { runPs, isAdmin } from './powershell.js';
import { SERVICE_NAME, SYSTEM_PATHS } from './paths.js';
import { logger } from '../core/logger.js';

export async function isServiceInstalled(): Promise<boolean> {
    try {
        await runPs(`Get-Service -Name "${SERVICE_NAME}" -ErrorAction Stop`);
        return true;
    } catch {
        return false;
    }
}

export async function isServiceRunning(): Promise<boolean> {
    try {
        const status = await runPs(`(Get-Service -Name "${SERVICE_NAME}").Status`);
        return status === 'Running';
    } catch {
        return false;
    }
}

export async function installService() {
    if (!await isAdmin()) {
        throw new Error('Admin privileges required to install service.');
    }

    if (await isServiceInstalled()) {
        logger.info('Service already installed.');
        return;
    }

    logger.info(`Installing service ${SERVICE_NAME}...`);
    // Note: We need to pass arguments to the proxy executable if needed, but for now we just point to the exe.
    // The proxy usually needs arguments like instance connection name.
    // If we run it as a service, we might need a wrapper or pass args in BinaryPathName.
    // For this implementation, we'll assume the proxy reads config or we update the service binpath later.
    // Actually, cloud_sql_proxy needs args. 
    // Strategy: The service command should probably be "cloudsqlctl connect --service" or similar, 
    // OR we register the proxy exe directly with arguments.
    // Let's register the proxy exe directly for now, but we'll need to update the binpath with the instance name when connecting.

    await runPs(`New-Service -Name "${SERVICE_NAME}" -BinaryPathName "${SYSTEM_PATHS.PROXY_EXE}" -StartupType Automatic`);
}

export async function uninstallService() {
    if (!await isAdmin()) {
        throw new Error('Admin privileges required to uninstall service.');
    }

    if (!await isServiceInstalled()) {
        return;
    }

    logger.info(`Uninstalling service ${SERVICE_NAME}...`);
    await stopService();
    // Remove-Service is available in PowerShell 6+, or use sc.exe
    // PowerShell 5.1 (default on Win10) might not have Remove-Service? It does.
    await runPs(`Remove-Service -Name "${SERVICE_NAME}"`);
}

export async function startService() {
    if (!await isAdmin()) {
        throw new Error('Admin privileges required to start service.');
    }
    logger.info(`Starting service ${SERVICE_NAME}...`);
    await runPs(`Start-Service -Name "${SERVICE_NAME}"`);
}

export async function stopService() {
    if (!await isAdmin()) {
        throw new Error('Admin privileges required to stop service.');
    }
    logger.info(`Stopping service ${SERVICE_NAME}...`);
    await runPs(`Stop-Service -Name "${SERVICE_NAME}" -Force`);
}

export async function updateServiceBinPath(args: string) {
    if (!await isAdmin()) {
        throw new Error('Admin privileges required to update service configuration.');
    }
    const binPath = `${SYSTEM_PATHS.PROXY_EXE} ${args}`;
    // Use sc.exe to config binPath as Set-Service doesn't always support it easily for args
    // Or use WMI/CIM
    // sc.exe config "cloudsql-proxy" binPath= "..."
    // Note: sc.exe requires space after binPath=
    await runPs(`sc.exe config "${SERVICE_NAME}" binPath= "${binPath}"`);
}
