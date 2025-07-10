import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionDto } from '../dtos/session.dto';

export const ActiveSession = createParamDecorator(
  (field: keyof SessionDto | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const session: SessionDto | undefined = request['session'];
    return field ? session?.[field] : session;
  },
);
