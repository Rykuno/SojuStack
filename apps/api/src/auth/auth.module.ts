import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';
import { QueuesModule } from 'src/queues/queues.module';
import { BetterAuthService } from './better-auth.service';

@Module({
  imports: [MailModule, QueuesModule],
  controllers: [AuthController],
  providers: [AuthService, BetterAuthService],
  exports: [BetterAuthService],
})
export class AuthModule {}
