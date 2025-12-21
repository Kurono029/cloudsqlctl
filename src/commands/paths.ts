import { Command } from 'commander';
import { PATHS, PATHS_SOURCE, PATHS_REASON } from '../system/paths.js';
import chalk from 'chalk';

export const pathsCommand = new Command('paths')
    .description('Show resolved system paths and configuration locations')
    .action(async () => {
        console.log(chalk.bold('\nCloudSQLCTL Paths Configuration\n'));

        const rows = [
            { key: 'Home Dir', value: PATHS.HOME },
            { key: 'Bin Dir', value: PATHS.BIN },
            { key: 'Logs Dir', value: PATHS.LOGS },
            { key: 'Config File', value: PATHS.CONFIG_FILE },
            { key: 'Proxy Exe', value: PATHS.PROXY_EXE },
            { key: 'Secrets Dir', value: PATHS.SECRETS },
        ];

        rows.forEach(row => {
            console.log(`${chalk.cyan(row.key.padEnd(15))}: ${row.value}`);
        });

        console.log(chalk.bold('\nResolution Source:'));
        console.log(`- Source: ${chalk.green(PATHS_SOURCE)}`);
        console.log(`- Reason: ${PATHS_REASON}`);

        console.log('');
    });
