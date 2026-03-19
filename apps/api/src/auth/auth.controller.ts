import { Controller, Req, Res, All, type RawBodyRequest, Inject } from '@nestjs/common';
import { type Request, type Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { BETTER_AUTH_PROVIDER, type BetterAuth } from './better-auth.provider';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Auth, AuthType } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(BETTER_AUTH_PROVIDER) private readonly betterAuth: BetterAuth) {}

  @ApiExcludeEndpoint()
  @Auth(AuthType.Optional)
  @All('/client/*path')
  async handler(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    if (req.rawBody) req.body = req.rawBody.toString();
    return toNodeHandler(this.betterAuth)(req, res);
  }
}
