import {
    Injectable,
    NestMiddleware,
    UnauthorizedException
} from "@nestjs/common";
import { Request, Response, NextFunction, json } from "express";
import * as jsonwebtoken from "jsonwebtoken";
import { LogService } from "src/logging/log.service";
import { JwksService } from "./jwks.service";

const AUTH_HEADER = "authorization";
const BEARER = "Bearer ";
export const USER_AUTH_PROPERTY = "user";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(private jwksService: JwksService, private logger: LogService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers[AUTH_HEADER];

        if (!authHeader) {
            throw new UnauthorizedException();
        }

        const token = authHeader.substring(BEARER.length);

        const dToken: any = jsonwebtoken.decode(token, { complete: true });

        if (
            !dToken ||
            !dToken.header ||
            !dToken.header.kid ||
            !dToken.header.alg ||
            !dToken.payload
        ) {
            this.logger.info("Malformed token");
            throw new UnauthorizedException();
        }

        if (dToken.header.alg !== "RS256") {
            this.logger.info("Wrong alg");
            throw new UnauthorizedException();
        }

        const publicKey = await this.jwksService.getToken(dToken.header.kid);

        jsonwebtoken.verify(token, publicKey, (err, verified) => {
            if (err) {
                this.logger.info("Not verified");
                throw new UnauthorizedException();
            }

            (req as any)[USER_AUTH_PROPERTY] = verified;

            next();
        });
    }
}
