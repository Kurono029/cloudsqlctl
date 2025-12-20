import { Command } from 'commander';
import { getLatestVersion, downloadProxy } from '../core/updater.js';
import { logger } from '../core/logger.js';

export const installCommand = new Command('install')
    .description('Download and install Cloud SQL Proxy')
    .option('-v, --version <version>', 'Specific version to install')
    .action(async (options) => {
        try {
            let version = options.version;
            if (!version) {
                logger.info('Fetching latest version...');
                version = await getLatestVersion();
            }
            logger.info(`Installing Cloud SQL Proxy version ${version}...`);
            await downloadProxy(version);
            logger.info('Installation successful.');
        } catch (error) {
            logger.error('Installation failed', error);
            process.exit(1);
        }
    });
