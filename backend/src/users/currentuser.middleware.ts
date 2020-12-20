import {
    Injectable,
    NestMiddleware,
    UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response, NextFunction, json } from "express";
import { USER_AUTH_PROPERTY } from "src/authentication/authentication.middleware";
import { LogService } from "src/logging/log.service";
import { Repository } from "typeorm";
import { User } from "./user.entity";

export const CURRENT_USER_PROPERTY = "current_user";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private logger: LogService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const { sub } = (req as any)[USER_AUTH_PROPERTY];

            const user = await this.userRepository.findOne({ sub });

            if (user) {
                (req as any)[CURRENT_USER_PROPERTY] = user;
                this.logger.addCtx({ requesterId: user.id });
                return next();
            }

            this.logger.info("User with this sub not found, creating", { sub });

            const newUser = await this.userRepository.save({ sub });

            this.logger.addCtx({ requesterId: newUser.id });
            (req as any)[CURRENT_USER_PROPERTY] = newUser;
            return next();
        } catch (err) {
            this.logger.error("Error in current user middleware", { err });
            throw err;
        }
    }
}
