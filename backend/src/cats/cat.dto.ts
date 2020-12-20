import { IsString } from "class-validator";

export class CatCreationDTO {
    @IsString()
    name!: string;
}