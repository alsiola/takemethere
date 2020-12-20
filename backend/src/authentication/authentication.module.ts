import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { JwksService } from "./jwks.service";
import { LogModule } from "../logging/log.module";
import { AuthenticationMiddleware } from "./authentication.middleware";

@Module({
    imports: [LogModule],
    controllers: [],
    providers: [JwksService],
    exports: [JwksService]
})
export class AuthenticationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes("*");
    }
}
