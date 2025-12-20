import { Command } from 'commander';
import { getLatestVersion, downloadProxy } from '../core/updater.js';
import { logger } from '../core/logger.js';
import { isRunning, stopProxy } from '../core/proxy.js';
import { setupEnvironment } from '../system/env.js';
import { generateScripts } from '../system/ps1.js';
import { installService } from '../system/service.js';

export const installCommand = new Command('install')
    .description('Download and install Cloud SQL Proxy, setup environment and service')
    .option('-v, --version <version>', 'Specific version to install')
    .action(async (options) => {
        try {
            if (await isRunning()) {
                logger.info('Stopping running proxy before installation...');
                await stopProxy();
            }

            let version = options.version;
            if (!version) {
                logger.info('Fetching latest version...');
                version = await getLatestVersion();
            }
            logger.info(`Installing Cloud SQL Proxy version ${version}...`);
            await downloadProxy(version);

            logger.info('Setting up environment variables...');
            await setupEnvironment();

            logger.info('Generating PowerShell scripts...');
            await generateScripts();

            logger.info('Installing Windows Service...');
            await installService();

            logger.info('Installation and setup successful.');
        } catch (error) {
            logger.error('Installation failed', error);
            process.exit(1);
        }
    });
