import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthenticationModule } from "./authentication/authentication.module";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { LogInterceptor } from "./logging/log.interceptor";
import { LogModule } from "./logging/log.module";
import { User } from "./users/user.entity";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        LogModule,
        AuthenticationModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: "postgres",
                host: config.get((c) => c.database.host),
                port: config.get((c) => c.database.port),
                username: config.get((c) => c.database.user),
                password: config.get((c) => c.database.password),
                database: config.get((c) => c.database.database),
                entities: [User],
                synchronize: true
            })
        }),
        UsersModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LogInterceptor
        }
    ],
    exports: []
})
export class AppModule {}
