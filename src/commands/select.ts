import { Command } from 'commander';
import inquirer from 'inquirer';
import { listInstances } from '../core/gcloud.js';
import { writeConfig } from '../core/config.js';
import { logger } from '../core/logger.js';

export const selectCommand = new Command('select')
    .description('Select a Cloud SQL instance')
    .action(async () => {
        try {
            logger.info('Fetching Cloud SQL instances...');
            const instances = await listInstances();

            if (instances.length === 0) {
                logger.warn('No instances found.');
                return;
            }

            const choices = instances.map(i => ({
                name: `${i.name} (${i.connectionName}) - ${i.state}`,
                value: i.connectionName
            }));

            const { selectedInstance } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedInstance',
                    message: 'Select an instance:',
                    choices
                }
            ]);

            await writeConfig({ selectedInstance });
            logger.info(`Selected instance: ${selectedInstance}`);
        } catch (error) {
            if (error instanceof Error && error.message.includes('Authentication required')) {
                logger.error(error.message);
            } else {
                logger.error('Failed to select instance', error);
            }
            process.exit(1);
        }
    });
