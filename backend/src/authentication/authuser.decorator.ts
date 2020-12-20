import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { USER_AUTH_PROPERTY } from "./authentication.middleware";

export type AuthUser = { sub: string };

export const AuthUser = createParamDecorator<
    unknown,
    ExecutionContext,
    AuthUser
>((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[USER_AUTH_PROPERTY];
});
