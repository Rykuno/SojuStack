import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';
import { BetterAuthProvider } from './better-auth.provider';
import { BetterAuthHooksService } from './better-auth-hooks.service';

@Module({
  imports: [MailModule],
  providers: [BetterAuthProvider, BetterAuthHooksService],
  controllers: [AuthController],
  exports: [BetterAuthProvider, BetterAuthHooksService],
})
export class AuthModule {}
