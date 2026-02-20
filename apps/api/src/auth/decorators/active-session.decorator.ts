import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveSessionDto } from '../dtos/active-session.dto';
import { AuthGuardRequest } from '../guards/auth.guard';

export const ActiveSession = createParamDecorator((_: void | undefined, ctx: ExecutionContext) => {
  const request: AuthGuardRequest = ctx.switchToHttp().getRequest();
  const session: ActiveSessionDto | undefined = request?.session;
  return session;
});
