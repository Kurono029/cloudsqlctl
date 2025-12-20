import path from 'path';
import os from 'os';

const PROGRAM_DATA = process.env.ProgramData || 'C:\\ProgramData';
const APP_DATA = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
const LOCAL_APP_DATA = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');

export const SYSTEM_PATHS = {
    HOME: path.join(PROGRAM_DATA, 'CloudSQLCTL'),
    LOGS: path.join(PROGRAM_DATA, 'CloudSQLCTL', 'logs'),
    BIN: path.join(PROGRAM_DATA, 'CloudSQLCTL', 'bin'),
    PROXY_EXE: path.join(PROGRAM_DATA, 'CloudSQLCTL', 'cloud_sql_proxy.exe'),
    USER_CONFIG_DIR: path.join(APP_DATA, 'CloudSQLCTL'),
    USER_CONFIG_FILE: path.join(APP_DATA, 'CloudSQLCTL', 'config.json'),
    TEMP: path.join(LOCAL_APP_DATA, 'CloudSQLCTL', 'temp'),
    SCRIPTS: path.join(PROGRAM_DATA, 'CloudSQLCTL', 'scripts')
};

export const ENV_VARS = {
    HOME: 'CLOUDSQLCTL_HOME',
    LOGS: 'CLOUDSQLCTL_LOGS',
    PROXY_PATH: 'CLOUDSQLCTL_PROXY_PATH',
    GOOGLE_CREDS: 'GOOGLE_APPLICATION_CREDENTIALS'
};

export const SERVICE_NAME = 'cloudsql-proxy';
