import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { AUTH_TYPE_KEY, AuthType } from '../decorators/auth.decorator';
import { Reflector } from '@nestjs/core';
import { Session, User } from 'better-auth/*';
import { BetterAuth, InjectBetterAuth } from '../better-auth.provider';

export interface AuthGuardRequest extends Request {
  session?: Session;
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Required;

  constructor(
    @InjectBetterAuth() private readonly betterAuth: BetterAuth,
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
    request.session = session?.session;
    request.user = session?.user;

    // if auth type is required, check if session exists
    if (authType === AuthType.Required) {
      if (!session) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
