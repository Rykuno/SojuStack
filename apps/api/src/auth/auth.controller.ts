import { Controller, Req, Res, All } from '@nestjs/common';
import { Auth, AuthType } from './decorators/auth.decorator';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { Auth as BetterAuth } from 'better-auth';
import { InjectBetterAuth } from './better-auth.provider';

@Controller('auth')
export class AuthController {
  constructor(@InjectBetterAuth() private readonly betterAuth: BetterAuth) {}

  @All('/client/*path')
  @Auth(AuthType.Public)
  async handler(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.betterAuth)(req, res);
  }
}
