import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post
} from "@nestjs/common";
import { CatsService } from "./cats.service";
import { CatCreationDTO } from "./cat.dto";
import { LogService } from "src/logging/log.service";

@Controller("cats")
export class CatsController {
    constructor(
        private readonly appService: CatsService,
        private readonly log: LogService
    ) {}

    @Get()
    getCats() {
        return this.appService.getCats();
    }

    @Get(":id")
    getCatById(@Param("id", ParseIntPipe) id: number) {
        const cat = this.appService.getCatById(id);

        if (!cat) {
            this.log.info("Cat not found");
            throw new NotFoundException();
        }

        return cat;
    }

    @Post()
    createCat(@Body() { name }: CatCreationDTO) {
        return this.appService.createCat(name);
    }
}
