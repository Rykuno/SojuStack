import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthGuardRequest } from '../guards/auth.guard';

export const ActiveUser = createParamDecorator((_: void, ctx: ExecutionContext) => {
  const request: AuthGuardRequest = ctx.switchToHttp().getRequest();
  return request.user;
});
