import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BetterAuthProvider } from './better-auth.provider';
import { MailModule } from 'src/mail/mail.module';
import { QueuesModule } from 'src/queues/queues.module';

@Module({
  imports: [MailModule, QueuesModule],
  controllers: [AuthController],
  providers: [AuthService, BetterAuthProvider],
  exports: [BetterAuthProvider],
})
export class AuthModule {}
