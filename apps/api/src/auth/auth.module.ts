import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { BetterAuthProvider } from './better-auth.provider';
import { AuthService } from './auth.service';

@Module({
  imports: [NotificationsModule],
  providers: [BetterAuthProvider, AuthService],
  controllers: [AuthController],
  exports: [BetterAuthProvider, AuthService],
})
export class AuthModule {}
