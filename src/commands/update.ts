import { Command } from 'commander';
import { getLatestVersion, downloadProxy } from '../core/updater.js';
import { logger } from '../core/logger.js';

export const updateCommand = new Command('update')
    .description('Update Cloud SQL Proxy to the latest version')
    .action(async () => {
        try {
            logger.info('Checking for updates...');
            const version = await getLatestVersion();
            logger.info(`Latest version is ${version}. Updating...`);
            await downloadProxy(version);
            logger.info('Update successful.');
        } catch (error) {
            logger.error('Update failed', error);
            process.exit(1);
        }
    });
