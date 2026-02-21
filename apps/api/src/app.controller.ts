import { Controller, Get } from '@nestjs/common';
import { Auth, AuthType } from './auth/decorators/auth.decorator';

@Controller()
export class AppController {
  @Get('/healthz')
  @Auth(AuthType.Public)
  healthz() {
    return {
      status: 'ok',
    };
  }
}
