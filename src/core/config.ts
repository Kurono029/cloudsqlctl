import path from 'path';
import fs from 'fs-extra';
import os from 'os';

const APP_NAME = 'CloudSQLCTL';
const LOCAL_APP_DATA = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
const APP_DIR = path.join(LOCAL_APP_DATA, APP_NAME);

export const PATHS = {
    APP_DIR,
    CONFIG_FILE: path.join(APP_DIR, 'config.json'),
    LOG_DIR: path.join(APP_DIR, 'logs'),
    BIN_DIR: path.join(APP_DIR, 'bin'),
    PROXY_EXE: path.join(APP_DIR, 'bin', 'cloud_sql_proxy.exe'),
    PID_FILE: path.join(APP_DIR, 'proxy.pid'),
};

export interface AppConfig {
    selectedInstance?: string;
    proxyPort?: number;
    autoUpdate?: boolean;
    lastUpdateCheck?: string;
}

export async function ensureDirs() {
    await fs.ensureDir(PATHS.APP_DIR);
    await fs.ensureDir(PATHS.LOG_DIR);
    await fs.ensureDir(PATHS.BIN_DIR);
}

export async function readConfig(): Promise<AppConfig> {
    try {
        await ensureDirs();
        if (!await fs.pathExists(PATHS.CONFIG_FILE)) {
            return {};
        }
        return await fs.readJson(PATHS.CONFIG_FILE);
    } catch (_error) {
        return {};
    }
}

export async function writeConfig(config: Partial<AppConfig>) {
    await ensureDirs();
    const current = await readConfig();
    await fs.writeJson(PATHS.CONFIG_FILE, { ...current, ...config }, { spaces: 2 });
}
