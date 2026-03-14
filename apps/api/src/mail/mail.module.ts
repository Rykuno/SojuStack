import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MAIL_TRANSPORT } from './transports/mail.transport';
import { MailpitTransport } from './transports/mailpit.transport';
import { ResendTransport } from './transports/resend.transport';
import { EnvService } from 'src/common/env/env.service';

@Module({
  providers: [
    MailService,
    ResendTransport,
    MailpitTransport,
    {
      provide: MAIL_TRANSPORT,
      inject: [EnvService, MailpitTransport, ResendTransport],
      useFactory: (
        envService: EnvService,
        mailpitTransport: MailpitTransport,
        resendTransport: ResendTransport,
      ) => {
        return envService.app.isProduction ? resendTransport : mailpitTransport;
      },
    },
  ],
  exports: [MailService],
})
export class MailModule {}
