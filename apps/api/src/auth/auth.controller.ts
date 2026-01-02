import {
  Controller,
  Get,
  Req,
  Res,
  SerializeOptions,
  UseInterceptors,
  All,
} from '@nestjs/common';
import { ActiveUser } from './decorators/active-user.decorator';
import { Auth, AuthType } from './decorators/auth.decorator';
import { ActiveUserDto } from './dtos/active-user.dto';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { ActiveSession } from './decorators/active-session.decorator';
import { ActiveSessionDto } from './dtos/active-session.dto';
import { TransformDataInterceptor } from 'src/common/interceptors/transform-data.interceptor';
import { Auth as BetterAuth } from 'better-auth';
import { InjectBetterAuth } from './better-auth.provider';

@Controller('auth')
export class AuthController {
  constructor(@InjectBetterAuth() private readonly betterAuth: BetterAuth) {}

  @Get('/user')
  @UseInterceptors(new TransformDataInterceptor(ActiveUserDto))
  @Auth(AuthType.Public)
  user(@ActiveUser() user: ActiveUserDto) {
    return user;
  }

  @Get('/session')
  @UseInterceptors(new TransformDataInterceptor(ActiveSessionDto))
  @Auth(AuthType.Public)
  @SerializeOptions({ type: ActiveSessionDto })
  session(@ActiveSession() session: ActiveSessionDto) {
    return session;
  }

  // @Get('/sessions')
  // @UseInterceptors(new TransformDataInterceptor(ActiveSessionDto))
  // @Auth(AuthType.Required)
  // sessions(@Request() req: ExpressRequest) {
  //   return this.betterAuth.api.listSessions({
  //     headers: fromNodeHeaders(req.headers),
  //   });
  // }

  @All('/client/*path')
  @Auth(AuthType.Public)
  async handler(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.betterAuth)(req, res);
  }
}
