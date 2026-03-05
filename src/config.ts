import fs from 'fs';
import path from 'path';
import { ColumnNames } from './classes/classes';

export interface AppConfig {
    baseUrl: string;
    environmentId: string;
    csvSeparator: string;
    optionsSeparator: string;
    csvPath: string;
    csvSchema: ColumnNames;
}

export function loadConfig(configPath: string = 'config.json'): AppConfig {
    const fullPath = path.resolve(process.cwd(), configPath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Configuration file not found at ${fullPath}`);
    }
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed as AppConfig;
}