import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CanActivate, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BETTER_AUTH_PROVIDER, type BetterAuth } from '../better-auth.provider';
import { AUTH_TYPE_KEY, AuthType } from '../decorators/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  static defaultAuthType = AuthType.Authenticated;
  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
    @Inject(BETTER_AUTH_PROVIDER)
    private readonly betterAuth: BetterAuth,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // get auth type from decorator
    const authType =
      this.reflector.getAllAndOverride<AuthType>(AUTH_TYPE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? AuthGuard.defaultAuthType;

    // get session from better-auth
    const session = await this.betterAuth.api.getSession({
      headers: request.headers,
    });

    // set session to request
    request.session = session;

    // if authenticated and no session, throw unauthorized
    if (authType === AuthType.Authenticated) {
      if (!session) {
        throw new UnauthorizedException();
      }
    }

    // if unauthenticated and session, throw unauthorized
    if (authType === AuthType.Unauthenticated) {
      if (session) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
