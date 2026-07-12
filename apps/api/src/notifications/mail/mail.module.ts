import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { type ConfigType } from '@nestjs/config';
import { AppConfig } from 'src/common/config';
import { NotificationQueue } from 'src/queues/enums/queue.enum';
import { QueuesModule } from 'src/queues/queues.module';
import { MailService } from './mail.service';
import { MailProcessorService } from './mail.worker';
import { MAIL_TRANSPORT } from './transports/mail.transport';
import { MailpitTransport } from './transports/mailpit.transport';
import { ResendTransport } from './transports/resend.transport';

@Module({
  imports: [
    QueuesModule,
    BullModule.registerQueue({
      name: NotificationQueue.email,
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 50,
        removeOnFail: 1000,
        backoff: {
          type: 'exponential',
          delay: 10000,
        },
      },
    }),
  ],
  providers: [
    MailService,
    ResendTransport,
    MailpitTransport,
    MailProcessorService,
    {
      provide: MAIL_TRANSPORT,
      inject: [AppConfig.KEY, MailpitTransport, ResendTransport],
      useFactory: (
        appConfig: ConfigType<typeof AppConfig>,
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
