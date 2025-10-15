import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/healthz')
  healthz() {
    return {
      status: 'ok',
    };
  }
}
