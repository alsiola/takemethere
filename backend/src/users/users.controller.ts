import {
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseUUIDPipe
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LogService } from "src/logging/log.service";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CurrentUser } from "./currentuser.decorator";

@Controller("users")
export class UsersController {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private logger: LogService
    ) {}

    @Get("me")
    public async getSelfUser(@CurrentUser() user: User) {
        return user;
    }

    @Get(":id")
    public async getUserById(@Param("id", ParseUUIDPipe) id: string) {
        const user = await this.usersRepository.findOne(id);

        if (!user) {
            this.logger.info("User not found", { id });
            throw new NotFoundException();
        }

        return user;
    }
}
