import { Module } from '@nestjs/common';
import { BetterAuthService } from './better-auth.service';
import { AuthController } from './auth.controller';
import { DatabasesModule } from '../databases/databases.module';
import { HttpAdapterHost } from '@nestjs/core';
import { toNodeHandler } from 'better-auth/node';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { betterAuthConfig } from './better-auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [betterAuthConfig],
    }),
    DatabasesModule,
    NotificationsModule,
  ],
  providers: [BetterAuthService],
  controllers: [AuthController],
  exports: [BetterAuthService],
})
export class AuthModule {
  constructor(
    private readonly adapter: HttpAdapterHost,
    private readonly betterAuthService: BetterAuthService,
  ) {
    this.adapter.httpAdapter.all(
      `${this.betterAuthService.basePath}/{*any}`,
      toNodeHandler(betterAuthService.client),
    );
  }
}
