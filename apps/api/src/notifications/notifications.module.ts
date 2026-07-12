import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [MailModule],
  exports: [MailModule],
})
export class NotificationsModule {}
