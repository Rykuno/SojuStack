import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BetterAuthService } from '../better-auth.service';
import { AUTH_TYPE_KEY, AuthType } from '../decorators/auth.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Required;

  constructor(
    private readonly betterAuthService: BetterAuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [authType] = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthGuard.defaultAuthType];

    const request = context.switchToHttp().getRequest();
    const session = await this.betterAuthService.client.api.getSession({
      headers: request.headers,
    });
    request['session'] = session?.session;

    if (authType === AuthType.Required) {
      if (!session) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
