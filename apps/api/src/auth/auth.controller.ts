import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ActiveUser } from './decorators/active-user.decorator';
import { Auth, AuthType } from './decorators/auth.decorator';
import { ActiveUserDto } from './dtos/active-user.dto';
import { BetterAuthService } from './better-auth.service';
import { Request as ExpressRequest } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { ActiveSession } from './decorators/active-session.decorator';
import { ActiveSessionDto } from './dtos/active-session.dto';
import { TransformDataInterceptor } from 'src/common/interceptors/transform-data.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly betterAuthService: BetterAuthService) {}

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

  @Get('/sessions')
  @UseInterceptors(new TransformDataInterceptor(ActiveSessionDto))
  @Auth(AuthType.Required)
  sessions(@Request() req: ExpressRequest) {
    return this.betterAuthService.client.api.listSessions({
      headers: fromNodeHeaders(req.headers),
    });
  }
}
