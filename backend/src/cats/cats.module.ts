import { Module } from "@nestjs/common";
import { LogModule } from "src/logging/log.module";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Module({
    imports: [LogModule],
    controllers: [CatsController],
    providers: [CatsService]
})
export class CatsModule {}
