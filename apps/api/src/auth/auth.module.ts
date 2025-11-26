import { Module } from '@nestjs/common';
import { BetterAuthService } from './better-auth.service';
import { AuthController } from './auth.controller';
import { HttpAdapterHost } from '@nestjs/core';
import { toNodeHandler } from 'better-auth/node';
import { NotificationsModule } from 'src/notifications/notifications.module';
import cors, { CorsOptions } from 'cors';
import { AppConfig } from 'src/common/config/app.config';
import { AuthConfig } from 'src/common/config/auth.config';

@Module({
  imports: [NotificationsModule],
  providers: [BetterAuthService],
  controllers: [AuthController],
  exports: [BetterAuthService],
})
export class AuthModule {
  constructor(
    private readonly adapter: HttpAdapterHost,
    private readonly betterAuthService: BetterAuthService,
    private readonly appConfig: AppConfig,
    private readonly authConfig: AuthConfig,
  ) {
    // this.adapter.httpAdapter.use(cors(this.appConfig.cors as CorsOptions));
    console.log(this.appConfig.cors);
    this.adapter.httpAdapter.use(
      cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: [
          'workspace-id',
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'Accept',
          'user-agent'
        ],
        credentials: true,
      }) as CorsOptions,
    );
    this.adapter.httpAdapter.all(
      `${this.authConfig.basePath}/{*any}`,
      toNodeHandler(this.betterAuthService.client),
    );
  }
}
