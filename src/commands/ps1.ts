import { Command } from 'commander';
import { generateScripts } from '../system/ps1.js';
import { logger } from '../core/logger.js';

export const ps1Command = new Command('ps1')
    .description('Manage PowerShell scripts');

ps1Command.command('generate')
    .description('Generate management PowerShell scripts')
    .action(async () => {
        try {
            await generateScripts();
            logger.info('PowerShell scripts generated successfully.');
        } catch (error) {
            logger.error('Failed to generate scripts', error);
            process.exit(1);
        }
    });
