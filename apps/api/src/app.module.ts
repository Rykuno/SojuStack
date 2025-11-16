import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabasesModule } from './databases/databases.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { NotificationsModule } from './notifications/notifications.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { BrowserSessionInterceptor } from './common/guards/browser-session.interceptor';
import { UsersModule } from './users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from './storage/storage.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { ClsModule } from 'nestjs-cls';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { DB_PROVIDER } from './databases/database.provider';
import { ConfigifyModule } from '@itgorillaz/configify';
import { CacheConfig } from './common/config/cache.config';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    MulterModule,
    ThrottlerModule.forRootAsync({
      inject: [CacheConfig],
      useFactory: (cacheConfig: CacheConfig) => {
        return {
          throttlers: [],
          storage: new ThrottlerStorageRedisService(cacheConfig.url),
        };
      },
    }),
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          imports: [DatabasesModule],
          adapter: new TransactionalAdapterDrizzleOrm({
            drizzleInstanceToken: DB_PROVIDER,
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
    AppService,
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
export class AppModule {}
