import { Command } from 'commander';
import { startProxy, isRunning } from '../core/proxy.js';
import { readConfig } from '../core/config.js';
import { logger } from '../core/logger.js';

export const startCommand = new Command('start')
    .description('Start the Cloud SQL Proxy')
    .option('-p, --port <port>', 'Port to listen on', parseInt)
    .action(async (options) => {
        try {
            if (await isRunning()) {
                logger.warn('Proxy is already running.');
                return;
            }

            const config = await readConfig();
            if (!config.selectedInstance) {
                logger.error('No instance selected. Run "cloudsqlctl select" first.');
                process.exit(1);
            }

            const port = options.port || config.proxyPort || 5432;

            logger.info(`Starting proxy for ${config.selectedInstance} on port ${port}...`);
            const pid = await startProxy(config.selectedInstance, port);
            logger.info(`Proxy started with PID ${pid}`);
        } catch (error) {
            logger.error('Failed to start proxy', error);
            process.exit(1);
        }
    });
