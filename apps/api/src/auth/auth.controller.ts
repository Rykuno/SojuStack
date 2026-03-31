import { Controller, Req, Res, All, type RawBodyRequest } from '@nestjs/common';
import { type Request, type Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Auth, AuthType } from './decorators/auth.decorator';
import { BetterAuthService } from './better-auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly betterAuth: BetterAuthService) {}

  @ApiExcludeEndpoint()
  @Auth(AuthType.Optional)
  @All('/client/*path')
  async handler(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    if (req.rawBody) req.body = req.rawBody.toString();
    return toNodeHandler(this.betterAuth.client)(req, res);
  }
}
