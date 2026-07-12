import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationQueue } from 'src/queues/enums/queue.enum';
import { MAIL_TRANSPORT, MailTransport } from './transports/mail.transport';
import { Inject } from '@nestjs/common';
import { SendEmailPayload } from './interfaces/mail.interface';
import { MailProcess } from './enums/mail.enums';

@Processor(NotificationQueue.email, {
  limiter: {
    max: 5,
    duration: 1000,
  },
  concurrency: 1,
})
export class MailProcessorService extends WorkerHost {
  constructor(@Inject(MAIL_TRANSPORT) private readonly mailTransport: MailTransport) {
    super();
  }

  async process(job: Job<SendEmailPayload, Promise<void>, MailProcess.send>) {
    switch (job.name) {
      case MailProcess.send:
        return this.mailTransport.send({
          to: job.data.to,
          subject: job.data.subject,
          html: job.data.html,
          text: job.data.html,
        });
    }
  }
}
