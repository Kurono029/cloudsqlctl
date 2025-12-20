import { Command } from 'commander';
import { stopProxy } from '../core/proxy.js';
import { logger } from '../core/logger.js';

export const stopCommand = new Command('stop')
    .description('Stop the Cloud SQL Proxy')
    .action(async () => {
        try {
            logger.info('Stopping proxy...');
            await stopProxy();
            logger.info('Proxy stopped.');
        } catch (error) {
            logger.error('Failed to stop proxy', error);
            process.exit(1);
        }
    });
