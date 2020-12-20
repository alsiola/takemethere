import * as winston from "winston";
const TransportStream = require("winston-transport");

class LocalTransport extends TransportStream {
    log({ level, message, ...rest }: any, next: any) {
        console.log(`[${level}]: ${message}   
${JSON.stringify(rest)}
`);
        next();
    }
}

export class BaseLogger {
    private static logger: winston.Logger;

    static getLogger() {
        if (!this.logger) {
            this.logger = winston.createLogger({
                transports: [new LocalTransport() as any]
            });
        }
        return this.logger;
    }
}
