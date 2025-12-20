import { Command } from 'commander';
import { setupEnvironment } from '../system/env.js';
import { logger } from '../core/logger.js';

export const setenvCommand = new Command('setenv')
    .description('Create system-wide environment variables')
    .action(async () => {
        try {
            await setupEnvironment();
            logger.info('Environment variables set successfully.');
        } catch (error) {
            logger.error('Failed to set environment variables', error);
            process.exit(1);
        }
    });
