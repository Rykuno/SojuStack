import { Controller, Get } from '@nestjs/common';
import { Auth, AuthType } from './auth/decorators/auth.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { HealthzDto } from './common/dto/healthz.dto';

@Controller()
export class AppController {
  @Get('/healthz')
  @Auth(AuthType.Public)
  @ApiOkResponse({ type: HealthzDto })
  healthz() {
    return {
      status: 'ok',
    } satisfies HealthzDto;
  }
}
