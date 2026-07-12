import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { CacheConfig } from 'src/common/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule.forFeature(CacheConfig)],
      inject: [CacheConfig.KEY],
      useFactory: (cacheConfig: ConfigType<typeof CacheConfig>) => {
        return {
          connection: {
            url: cacheConfig.url,
          },
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
