import { Command } from 'commander';
import { isRunning } from '../core/proxy.js';
import { logger } from '../core/logger.js';
import { readConfig } from '../core/config.js';
import { isServiceInstalled, isServiceRunning } from '../system/service.js';

export const statusCommand = new Command('status')
    .description('Check the status of the Cloud SQL Proxy and Service')
    .action(async () => {
        try {
            const processRunning = await isRunning();
            const serviceInstalled = await isServiceInstalled();
            const serviceRunning = serviceInstalled ? await isServiceRunning() : false;
            const config = await readConfig();

            logger.info('--- Status ---');

            if (serviceInstalled) {
                logger.info(`Service: ${serviceRunning ? 'RUNNING' : 'STOPPED'}`);
            } else {
                logger.info('Service: NOT INSTALLED');
            }

            if (processRunning) {
                logger.info('Process: RUNNING');
                logger.info(`Instance: ${config.selectedInstance || 'Unknown'}`);
                logger.info(`Port: ${config.proxyPort || 5432}`);
            } else {
                logger.info('Process: STOPPED');
            }

            if (!processRunning && !serviceRunning) {
                logger.info('Cloud SQL Proxy is not active.');
            }

        } catch (error) {
            logger.error('Failed to check status', error);
            process.exit(1);
        }
    });
