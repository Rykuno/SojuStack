import { Module } from '@nestjs/common';
import { BetterAuthService } from './better-auth.service';
import { AuthController } from './auth.controller';
import { HttpAdapterHost } from '@nestjs/core';
import { toNodeHandler } from 'better-auth/node';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from 'src/notifications/notifications.module';
import * as cors from 'cors';
import {
  AppConfig,
  AuthConfig,
  Config,
} from 'src/common/configs/config.interface';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Session } from './entities/session.entity';
import { Verification } from './entities/verifications.entity';
import { Account } from './entities/accounts.entity';

@Module({
  imports: [
    ConfigModule,
    NotificationsModule,
    MikroOrmModule.forFeature([Session, Verification, Account]),
  ],
  providers: [BetterAuthService],
  controllers: [AuthController],
  exports: [BetterAuthService],
})
export class AuthModule {
  constructor(
    private readonly adapter: HttpAdapterHost,
    private readonly betterAuthService: BetterAuthService,
    private readonly configService: ConfigService<Config>,
  ) {
    const basePath =
      this.configService.getOrThrow<AuthConfig>('auth').betterAuth.basePath;
    const corsOptions = this.configService.getOrThrow<AppConfig>('app').cors;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.adapter.httpAdapter.use(cors(corsOptions));
    this.adapter.httpAdapter.all(
      `${basePath}/{*any}`,
      toNodeHandler(betterAuthService.client),
    );
  }
}
