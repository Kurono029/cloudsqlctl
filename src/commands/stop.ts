import { Command } from 'commander';
import { stopProxy } from '../core/proxy.js';
import { logger } from '../core/logger.js';
import { isServiceRunning, stopService } from '../system/service.js';

export const stopCommand = new Command('stop')
    .description('Stop the Cloud SQL Proxy or Service')
    .action(async () => {
        try {
            if (await isServiceRunning()) {
                logger.info('Stopping Cloud SQL Proxy Service...');
                await stopService();
                logger.info('Service stopped.');
            } else {
                logger.info('Stopping proxy process...');
                await stopProxy();
                logger.info('Proxy stopped.');
            }
        } catch (error) {
            logger.error('Failed to stop proxy', error);
            process.exit(1);
        }
    });
