import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthGuardRequest } from '../guards/auth.guard';

export const ActiveSession = createParamDecorator((_: void | undefined, ctx: ExecutionContext) => {
  const request: AuthGuardRequest = ctx.switchToHttp().getRequest();
  return request.session;
});
