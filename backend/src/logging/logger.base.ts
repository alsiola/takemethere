import * as winston from "winston";

export class BaseLogger {
    private static logger: winston.Logger;

    static getLogger() {
        if (!this.logger) {
            this.logger = winston.createLogger({
                transports: [new winston.transports.Console()]
            });
        }
        return this.logger;
    }
}
