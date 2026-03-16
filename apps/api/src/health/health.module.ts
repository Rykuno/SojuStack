import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [TerminusModule, StorageModule],
  controllers: [HealthController],
})
export class HealthModule {}
