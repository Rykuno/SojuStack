import { Module } from '@nestjs/common';
import { AppConfig } from 'src/common/config/app.config';
import { MailService } from './mail.service';
import { MAIL_TRANSPORT } from './transports/mail.transport';
import { MailpitTransport } from './transports/mailpit.transport';
import { ResendTransport } from './transports/resend.transport';

@Module({
  providers: [
    MailService,
    ResendTransport,
    MailpitTransport,
    {
      provide: MAIL_TRANSPORT,
      inject: [AppConfig, MailpitTransport, ResendTransport],
      useFactory: (
        appConfig: AppConfig,
        mailpitTransport: MailpitTransport,
        resendTransport: ResendTransport,
      ) => {
        return appConfig.isProduction ? resendTransport : mailpitTransport;
      },
    },
  ],
  exports: [MailService],
})
export class MailModule {}
