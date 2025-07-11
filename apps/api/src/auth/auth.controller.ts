import { Controller, Get } from '@nestjs/common';
import { ActiveUser } from './decorators/active-user.decorator';
import { Auth, AuthType } from './decorators/auth.decorator';
import { ActiveUserDto } from './dtos/active-user.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('/session')
  @Auth(AuthType.Public)
  session(@ActiveUser() user: ActiveUserDto) {
    return user;
  }

  @Get('/test')
  @Auth(AuthType.Public)
  test(@ActiveUser() user: ActiveUserDto) {
    return user;
  }
}
