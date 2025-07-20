import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  EnvironmentVariables,
  validate,
} from './common/configs/env-validation';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import config from './common/configs/config';
import { BrowserSessionInterceptor } from './common/guards/browser-session.interceptor';
import { UsersModule } from './users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from './storage/storage.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Config, DatabaseConfig } from './common/configs/config.interface';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      expandVariables: true,
      load: [config],
    }),
    MikroOrmModule.forRoot(),
    MulterModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Config>) => {
        return {
          throttlers: [],
          storage: new ThrottlerStorageRedisService(
            configService.getOrThrow<DatabaseConfig>(
              'database',
            ).redis.connectionString,
          ),
        };
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ lruSize: 5000 }),
            }),
            createKeyv(configService.getOrThrow('REDIS_URL')),
          ],
        };
      },
    }),
    AuthModule,
    NotificationsModule,
    UsersModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: BrowserSessionInterceptor,
    },
  ],
})
export class AppModule {}
