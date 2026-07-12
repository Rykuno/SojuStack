import { Module } from '@nestjs/common';
import { CacheConfig, configs } from './config';
import { OpenApiModule } from './open-api/open-api.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { envSchema } from './config/env.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule } from '@nestjs/throttler';
import { StorageModule } from './storage/storage.module';
import dayjs from 'dayjs';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

@Module({
  imports: [
    OpenApiModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: configs,
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    HttpModule.register({
      global: true,
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule.forFeature(CacheConfig)],
      inject: [CacheConfig.KEY],
      useFactory: (configuration: ConfigType<typeof CacheConfig>) => {
        return {
          stores: [createKeyv(configuration.url)],
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forFeature(CacheConfig)],
      inject: [CacheConfig.KEY],
      useFactory: (configuration: ConfigType<typeof CacheConfig>) => {
        console.log('registering throttler module', configuration);
        return {
          throttlers: [
            {
              name: 'burst',
              ttl: dayjs.duration(10, 'seconds').asMilliseconds(),
              limit: 50,
            },
            {
              name: 'sustained',
              ttl: dayjs.duration(60, 'seconds').asMilliseconds(),
              limit: 300,
            },
          ],
          storage: new ThrottlerStorageRedisService(configuration.url),
        };
      },
    }),
    StorageModule,
    ConfigModule,
  ],
  exports: [ConfigModule, OpenApiModule],
})
export class CommonModule {}
