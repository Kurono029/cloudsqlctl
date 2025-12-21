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

function buildServiceBinPath(proxyExe: string, instance: string, port: number, extraArgs: string[]): string {
    return `"${proxyExe}" ${instance} --port=${port} ${extraArgs.join(' ')}`.trim();
}

export async function installService(instance: string, port: number = 5432, extraArgs: string[] = []) {
    if (!await isAdmin()) {
        throw new Error('Admin privileges required to install service.');
    }

    if (await isServiceInstalled()) {
        logger.info('Service already installed.');
        return;
    }

    logger.info(`Installing service ${SERVICE_NAME}...`);

    const binPath = buildServiceBinPath(SYSTEM_PATHS.PROXY_EXE, instance, port, extraArgs);

    // Use New-Service with single-quoted BinaryPathName
    await runPs(`New-Service -Name "${SERVICE_NAME}" -BinaryPathName '${binPath}' -StartupType Automatic`);
}

export async function updateServiceBinPath(instance: string, port: number = 5432, extraArgs: string[] = []) {
    if (!await isAdmin()) {
        throw new Error('Admin privileges required to update service configuration.');
    }

    const binPath = buildServiceBinPath(SYSTEM_PATHS.PROXY_EXE, instance, port, extraArgs);

    // Use CIM/WMI to update service path
    await runPs(`$svc = Get-CimInstance Win32_Service -Filter "Name='${SERVICE_NAME}'"; Invoke-CimMethod -InputObject $svc -MethodName Change -Arguments @{ PathName = '${binPath}' }`);
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

    // Use sc.exe delete instead of Remove-Service for better compatibility
    await runPs(`sc.exe delete "${SERVICE_NAME}"`);
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
