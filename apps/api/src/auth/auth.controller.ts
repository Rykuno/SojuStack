import { Controller, Get } from '@nestjs/common';
import { ActiveSession } from './decorators/active-user.decorator';
import { Auth, AuthType } from './decorators/auth.decorator';
import { SessionDto } from './dtos/session.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('/session')
  @Auth(AuthType.Public)
  async session(@ActiveSession() session: SessionDto) {
    return session;
  }
}
