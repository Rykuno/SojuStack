import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from 'src/common/configs/app.config';
import { mailConfig } from './mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, mailConfig],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class NotificationsModule {}
