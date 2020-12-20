import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CURRENT_USER_PROPERTY } from "./currentuser.middleware";
import { User } from "./user.entity";

export const CurrentUser = createParamDecorator<
    unknown,
    ExecutionContext,
    User
>((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[CURRENT_USER_PROPERTY];
});
