import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_TYPE_KEY, AuthType } from '../decorators/auth.decorator';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { BETTER_AUTH_PROVIDER, BetterAuth } from '../better-auth.provider';
import { SessionDto } from '../dto/session.dto';
import { UserDto } from 'src/users/dto/user.dto';

export interface AuthGuardRequest extends Request {
  session?: SessionDto;
  user?: UserDto;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Required;

  constructor(
    @Inject(BETTER_AUTH_PROVIDER) private readonly betterAuth: BetterAuth,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get auth type from reflector
    const [authType] = this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthGuard.defaultAuthType];

    // get request
    const request: AuthGuardRequest = context.switchToHttp().getRequest();

    // get session from better-auth
    const session = await this.betterAuth.api.getSession({
      headers: request.headers,
    });

    // set session and user on request
    request.session = session?.session as SessionDto;
    request.user = session?.user as UserDto;

    // if auth type is required, check if session exists
    if (authType === AuthType.Required) {
      if (!session) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
