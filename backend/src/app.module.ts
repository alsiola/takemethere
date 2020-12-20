import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { AuthenticationModule } from "./authentication/authentication.module";
import { CatsModule } from "./cats/cats.module";
import { LogInterceptor } from "./logging/log.interceptor";
import { LogModule } from "./logging/log.module";

@Module({
    imports: [CatsModule, LogModule, AuthenticationModule],
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
