import { Command } from 'commander';
import { checkEnvironmentDetailed } from '../system/env.js';
import { isServiceInstalled, isServiceRunning } from '../system/service.js';
import { PATHS } from '../system/paths.js';
import fs from 'fs-extra';
import { logger } from '../core/logger.js';
import { isAdmin } from '../system/powershell.js';

export const checkCommand = new Command('check')
    .description('Verify full system configuration')
    .option('--scope <scope>', 'Environment scope (User, Machine, or auto)', 'auto')
    .action(async (options) => {
        try {
            logger.info('Checking system configuration...');

            let scope: 'Machine' | 'User' = 'User';
            if (options.scope === 'auto') {
                scope = await isAdmin() ? 'Machine' : 'User';
            } else {
                scope = options.scope;
            }

            const envCheck = await checkEnvironmentDetailed(scope);
            if (envCheck.ok) {
                logger.info(`Environment Variables (${scope}): OK`);
            } else {
                logger.warn(`Environment Variables (${scope}): ISSUES FOUND`);
                envCheck.problems.forEach(p => logger.warn(`  - ${p}`));
            }

            const binaryOk = await fs.pathExists(PATHS.PROXY_EXE);
            logger.info(`Proxy Binary: ${binaryOk ? 'OK' : 'MISSING'}`);

            const serviceInstalled = await isServiceInstalled();
            logger.info(`Service Installed: ${serviceInstalled ? 'YES' : 'NO'}`);

            if (serviceInstalled) {
                const serviceRunning = await isServiceRunning();
                logger.info(`Service Running: ${serviceRunning ? 'YES' : 'NO'}`);
            }

            if (envCheck.ok && binaryOk) {
                logger.info('System check passed.');
            } else {
                logger.warn('System check failed. Run "cloudsqlctl repair" to fix.');
                process.exit(1);
            }
        } catch (error) {
            logger.error('Check failed', error);
            process.exit(1);
        }
    });
