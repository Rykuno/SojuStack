import { Controller, Get } from '@nestjs/common';
import { Auth, AuthType } from './auth/decorators/auth.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { HealthzDto } from './common/dto/healthz.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { Serialize } from './common/decorators/serialize.decorator';

@Controller()
export class AppController {
  @Get('/healthz')
  @Auth(AuthType.Public)
  @SkipThrottle()
  @ApiOkResponse({ type: HealthzDto })
  @Serialize(HealthzDto)
  healthz(): HealthzDto {
    return {
      status: 'ok',
    };
  }
}
