import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserDto } from '../dtos/active-user.dto';
import { AuthGuardRequest } from '../guards/auth.guard';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserDto | undefined, ctx: ExecutionContext) => {
    const request: AuthGuardRequest = ctx.switchToHttp().getRequest();
    const user: ActiveUserDto | undefined = request?.user;
    return field ? user?.[field] : user;
  },
);
