import { Injectable, Scope } from "@nestjs/common";
import * as winston from "winston";
import { BaseLogger } from "./logger.base";

@Injectable({ scope: Scope.REQUEST })
export class LogService {
    private logger: winston.Logger;
    private ctx = {};

    constructor() {
        this.logger = BaseLogger.getLogger().child({});
    }

    addCtx(ctx: {}) {
        this.ctx = { ...this.ctx, ...ctx };
    }

    info(msg: string, ctx?: {}) {
        this.logger.info(msg, { ...this.ctx, ...ctx });
    }

    error(msg: string, ctx?: {}) {
        this.logger.error(msg, { ...this.ctx, ...ctx });
    }

    warn(msg: string, ctx?: {}) {
        this.logger.warn(msg, { ...this.ctx, ...ctx });
    }

    debug(msg: string, ctx?: {}) {
        this.logger.debug(msg, { ...this.ctx, ...ctx });
    }
}
