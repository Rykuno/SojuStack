import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { BetterAuthService } from './better-auth.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [AuthController],
  providers: [BetterAuthService],
  exports: [BetterAuthService],
})
export class AuthModule {}
