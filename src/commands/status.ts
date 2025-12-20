import { Command } from 'commander';
import { isRunning } from '../core/proxy.js';
import { logger } from '../core/logger.js';
import { readConfig } from '../core/config.js';

export const statusCommand = new Command('status')
    .description('Check the status of the Cloud SQL Proxy')
    .action(async () => {
        try {
            const running = await isRunning();
            const config = await readConfig();

            if (running) {
                logger.info('Proxy is RUNNING');
                logger.info(`Instance: ${config.selectedInstance || 'Unknown'}`);
                logger.info(`Port: ${config.proxyPort || 5432}`);
            } else {
                logger.info('Proxy is STOPPED');
            }
        } catch (error) {
            logger.error('Failed to check status', error);
            process.exit(1);
        }
    });
