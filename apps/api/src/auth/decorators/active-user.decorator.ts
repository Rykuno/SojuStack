import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserDto } from '../dtos/active-user.dto';
import { AuthGuardRequest } from '../guards/auth.guard';

export const ActiveUser = createParamDecorator((_: void, ctx: ExecutionContext) => {
  const request: AuthGuardRequest = ctx.switchToHttp().getRequest();
  const user: ActiveUserDto | undefined = request?.user;
  return user;
});
