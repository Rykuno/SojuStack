import { Controller, Req, Res, All, RawBodyRequest, Inject } from '@nestjs/common';
import { Auth, AuthType } from './decorators/auth.decorator';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { BETTER_AUTH_PROVIDER, BetterAuth } from './better-auth.provider';

@Controller('auth')
export class AuthController {
  constructor(@Inject(BETTER_AUTH_PROVIDER) private readonly betterAuth: BetterAuth) {}

  @All('/client/*path')
  @Auth(AuthType.Public)
  async handler(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    if (req.rawBody) req.body = req.rawBody.toString();
    return toNodeHandler(this.betterAuth)(req, res);
  }
}
