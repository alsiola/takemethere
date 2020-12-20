import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogModule } from "src/logging/log.module";
import { CurrentUserMiddleware } from "./currentuser.middleware";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";

@Module({
    controllers: [UsersController],
    imports: [TypeOrmModule.forFeature([User]), LogModule]
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurrentUserMiddleware).forRoutes("*");
    }
}
