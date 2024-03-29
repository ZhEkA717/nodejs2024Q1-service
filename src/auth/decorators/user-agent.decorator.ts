import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserAgent = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.headers['user-agent'];
  },
);
