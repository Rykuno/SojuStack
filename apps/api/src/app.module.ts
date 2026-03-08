import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabasesModule } from './databases/databases.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { NotificationsModule } from './notifications/notifications.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { UsersModule } from './users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from './storage/storage.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { ClsModule } from 'nestjs-cls';
import { ConfigifyModule } from '@itgorillaz/configify';
import { CacheConfig } from './common/config/cache.config';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { DRIZZLE_PROVIDER } from './databases/drizzle.provider';
import { SecurityHeadersMiddleware } from './common/middlewares/security-headers.middleware';
import { secondsToMilliseconds } from 'date-fns';
import bytes from 'bytes';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    EventEmitterModule.forRoot(),
    MulterModule.register({
      limits: {
        fileSize: Number(bytes('1BG')),
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [CacheConfig],
      useFactory: (cacheConfig: CacheConfig) => {
        return {
          throttlers: [
            {
              ttl: secondsToMilliseconds(60),
              limit: 300,
            },
          ],
          storage: new ThrottlerStorageRedisService(cacheConfig.url),
        };
      },
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [DatabasesModule],
          adapter: new TransactionalAdapterDrizzleOrm({
            drizzleInstanceToken: DRIZZLE_PROVIDER,
          }),
        }),
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [CacheConfig],
      useFactory: (cacheConfig: CacheConfig) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ lruSize: 5000 }),
            }),
            createKeyv(cacheConfig.url),
          ],
        };
      },
    }),
    DatabasesModule,
    AuthModule,
    NotificationsModule,
    UsersModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*');
  }
}
