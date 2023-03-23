import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (!request.user) {
            console.log("User didn't login");
            return;
        }

        if (data) {
            return request.user[data];
        }

        return request.user;
    },
);
