import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { BetterAuthProvider } from './better-auth.provider';
import { BetterAuthHooksService } from './better-auth-hooks.service';

@Module({
  imports: [NotificationsModule],
  providers: [BetterAuthProvider, BetterAuthHooksService],
  controllers: [AuthController],
  exports: [BetterAuthProvider, BetterAuthHooksService],
})
export class AuthModule {}
