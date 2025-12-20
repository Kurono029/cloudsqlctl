import { Command } from 'commander';
import { logger } from '../core/logger.js';
import { checkGcloudInstalled, getActiveAccount } from '../core/gcloud.js';
import axios from 'axios';

export const doctorCommand = new Command('doctor')
    .description('Run diagnostics to verify environment setup')
    .action(async () => {
        logger.info('Running diagnostics...');

        // Check gcloud
        const gcloudInstalled = await checkGcloudInstalled();
        if (gcloudInstalled) {
            logger.info('✅ gcloud CLI is installed');
        } else {
            logger.error('❌ gcloud CLI is NOT installed');
        }

        // Check Auth
        const account = await getActiveAccount();
        if (account) {
            logger.info(`✅ Authenticated as: ${account}`);
        } else {
            logger.warn('⚠️ No active gcloud account found. Run "gcloud auth login"');
        }

        // Check Network (GitHub API)
        try {
            await axios.get('https://api.github.com');
            logger.info('✅ GitHub API is reachable');
        } catch (_e) {
            logger.error('❌ GitHub API is NOT reachable');
        }

        logger.info('Diagnostics complete.');
    });
