import { Command } from 'commander';
import { installService, uninstallService, startService, stopService, isServiceInstalled, isServiceRunning, updateServiceBinPath, setServiceStartupType } from '../system/service.js';
import { logger } from '../core/logger.js';

export const serviceCommand = new Command('service')
    .description('Manage the Cloud SQL Proxy Windows Service (Requires Admin)');

serviceCommand.command('install')
    .description('Install the Windows Service')
    .requiredOption('-i, --instance <connectionName>', 'Instance connection name')
    .option('-p, --port <port>', 'Port number', '5432')
    .option('-c, --credentials <path>', 'Path to service account JSON key')
    .action(async (options) => {
        try {
            const extraArgs = [];
            if (options.credentials) {
                extraArgs.push(`--credentials-file "${options.credentials}"`);
            }
            await installService(options.instance, parseInt(options.port), extraArgs);
            logger.info('Service installed successfully.');
        } catch (error) {
            logger.error('Failed to install service', error);
            process.exit(1);
        }
    });

serviceCommand.command('configure')
    .description('Update Service Configuration')
    .requiredOption('-i, --instance <connectionName>', 'Instance connection name')
    .option('-p, --port <port>', 'Port number', '5432')
    .option('-c, --credentials <path>', 'Path to service account JSON key')
    .action(async (options) => {
        try {
            const extraArgs = [];
            if (options.credentials) {
                extraArgs.push(`--credentials-file "${options.credentials}"`);
            }
            await updateServiceBinPath(options.instance, parseInt(options.port), extraArgs);
            logger.info('Service configured successfully.');
        } catch (error) {
            logger.error('Failed to configure service', error);
            process.exit(1);
        }
    });

serviceCommand.command('remove')
    .description('Remove the Windows Service')
    .action(async () => {
        try {
            await uninstallService();
            logger.info('Service removed successfully.');
        } catch (error) {
            logger.error('Failed to remove service', error);
            process.exit(1);
        }
    });

serviceCommand.command('start')
    .description('Start the Windows Service')
    .action(async () => {
        try {
            await startService();
            logger.info('Service started successfully.');
        } catch (error) {
            logger.error('Failed to start service', error);
            process.exit(1);
        }
    });

serviceCommand.command('stop')
    .description('Stop the Windows Service')
    .action(async () => {
        try {
            await stopService();
            logger.info('Service stopped successfully.');
        } catch (error) {
            logger.error('Failed to stop service', error);
            process.exit(1);
        }
    });

serviceCommand.command('status')
    .description('Check Service Status')
    .action(async () => {
        try {
            const installed = await isServiceInstalled();
            if (!installed) {
                logger.info('Service is NOT installed.');
                return;
            }
            const running = await isServiceRunning();
            logger.info(`Service is ${running ? 'RUNNING' : 'STOPPED'}.`);
        } catch (error) {
            logger.error('Failed to check service status', error);
            process.exit(1);
        }
    });

serviceCommand.command('startup')
    .description('Set Service Startup Type')
    .argument('<type>', 'Startup type (automatic, manual, disabled, delayed)')
    .action(async (type) => {
        const validTypes = ['automatic', 'manual', 'disabled', 'delayed'];
        const normalizedType = type.toLowerCase();

        if (!validTypes.includes(normalizedType)) {
            logger.error(`Invalid startup type. Must be one of: ${validTypes.join(', ')}`);
            process.exit(1);
        }

        try {
            const typeMap: Record<string, 'Automatic' | 'Manual' | 'Disabled' | 'Delayed'> = {
                'automatic': 'Automatic',
                'manual': 'Manual',
                'disabled': 'Disabled',
                'delayed': 'Delayed'
            };
            await setServiceStartupType(typeMap[normalizedType]);
        } catch (error) {
            logger.error('Failed to set startup type', error);
            process.exit(1);
        }
    });
