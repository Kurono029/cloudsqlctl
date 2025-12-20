export interface AppConfig {
    selectedInstance?: string;
    proxyPort?: number;
    autoUpdate?: boolean;
    lastUpdateCheck?: string;
}

export interface GcloudInstance {
    connectionName: string;
    name: string;
    region: string;
    project: string;
    databaseVersion: string;
    state: string;
}

export interface ProxyStatus {
    running: boolean;
    pid?: number;
    port?: number;
    instance?: string;
}
