import { Injectable } from "@nestjs/common";

import * as de from "dotenv-flow";

de.config();

export type Config = typeof configuration;

const getConfigItem = <T = string>(
    envVar: string,
    coerce: (a: string) => T = (a: string) => a as any
): T => {
    const val = process.env[envVar];

    if (!val) {
        throw new Error(`config "${envVar}" not set`);
    }

    return coerce(val) as any;
};

export const configuration = {
    database: {
        host: getConfigItem("DB_HOST"),
        port: getConfigItem("DB_PORT", parseInt),
        user: getConfigItem("DB_USER"),
        password: getConfigItem("DB_PASS"),
        database: getConfigItem("DB_DATABASE")
    }
};

console.dir(configuration);

@Injectable()
export class ConfigService {
    get<T>(f: (a: Config) => T): T {
        return f(configuration);
    }
}
