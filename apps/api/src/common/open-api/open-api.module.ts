import { Module } from '@nestjs/common';
import { OpenApiService } from './open-api.service';

@Module({
  providers: [OpenApiService],
  exports: [OpenApiService],
})
export class OpenApiModule {}
