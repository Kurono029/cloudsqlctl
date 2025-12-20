import fs from 'fs-extra';
import { SYSTEM_PATHS } from './paths.js';
import { checkEnvironment, setupEnvironment } from './env.js';
import { isServiceInstalled, installService } from './service.js';
import { getLatestVersion, downloadProxy } from '../core/updater.js';
import { generateScripts } from './ps1.js';
import { logger } from '../core/logger.js';
import { isAdmin } from './powershell.js';

export async function selfHeal() {
    logger.info('Running self-healing checks...');

    const admin = await isAdmin();

    // 1. Check Environment Variables
    if (!await checkEnvironment()) {
        if (admin) {
            logger.warn('Environment variables missing or incorrect. Fixing...');
            try {
                await setupEnvironment();
            } catch (e) {
                logger.error('Failed to fix environment variables', e);
            }
        } else {
            logger.warn('Environment variables missing or incorrect. Run as Administrator to fix.');
        }
    }

    // 2. Check Proxy Binary
    if (!await fs.pathExists(SYSTEM_PATHS.PROXY_EXE)) {
        logger.warn('Proxy binary missing. Downloading...');
        try {
            const version = await getLatestVersion();
            await downloadProxy(version);
        } catch (e) {
            logger.error('Failed to download proxy binary', e);
        }
    }

    // 3. Check Scripts
    try {
        await generateScripts();
    } catch (e) {
        logger.error('Failed to generate PowerShell scripts', e);
    }

    // 4. Check Service
    if (!await isServiceInstalled()) {
        if (admin) {
            logger.warn('Service not installed. Installing...');
            try {
                await installService();
            } catch (e) {
                logger.error('Failed to install service', e);
            }
        } else {
            logger.warn('Service not installed. Run as Administrator to fix.');
        }
    }

    logger.info('Self-healing complete.');
}
