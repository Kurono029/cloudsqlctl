import { Command } from 'commander';
import { logger } from '../core/logger.js';
import { PATHS } from '../core/config.js';
import fs from 'fs-extra';

export const resetCommand = new Command('reset')
    .description('Reset configuration and remove local files')
    .option('--yes', 'Confirm reset without prompting')
    .action(async (options) => {
        try {
            if (!options.yes) {
                logger.warn('This will remove all configuration and logs.');
                logger.warn(`  - Config: ${PATHS.CONFIG_FILE}`);
                logger.warn(`  - Logs: ${PATHS.LOGS}`);
                logger.error('Operation aborted. Use --yes to confirm.');
                process.exit(1);
            }

            logger.info('Resetting configuration...');
            await fs.remove(PATHS.CONFIG_FILE);
            await fs.remove(PATHS.LOGS);
            // Maybe keep the binary?
            logger.info('Reset complete.');
        } catch (error) {
            logger.error('Reset failed', error);
            process.exit(1);
        }
    });
