import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { BetterAuthProvider } from './better-auth.provider';

@Module({
  imports: [NotificationsModule],
  providers: [BetterAuthProvider],
  controllers: [AuthController],
  exports: [BetterAuthProvider],
})
export class AuthModule {}
