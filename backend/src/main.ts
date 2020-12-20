import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BaseLogger } from "./logging/logger.base";
import { NestLoggerAdapter } from "./logging/logger.nestadapter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new NestLoggerAdapter(BaseLogger.getLogger())
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
