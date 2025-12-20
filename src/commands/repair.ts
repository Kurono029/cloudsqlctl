import { Command } from 'commander';
import { selfHeal } from '../system/selfheal.js';
import { logger } from '../core/logger.js';

export const repairCommand = new Command('repair')
    .description('Self-heal missing or corrupted files and configurations')
    .action(async () => {
        try {
            await selfHeal();
        } catch (error) {
            logger.error('Repair failed', error);
            process.exit(1);
        }
    });
