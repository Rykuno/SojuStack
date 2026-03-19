import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../mail/mail.service';
import { APP_QUEUE_NAME, QUEUE_JOB_NAMES, QueueJobPayloads } from './queue.jobs';

@Processor(APP_QUEUE_NAME)
export class QueuesProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<unknown, void, string>) {
    switch (job.name) {
      case QUEUE_JOB_NAMES.mailSendSignInOtp:
        return this.mailService.sendSignInOtp(job.data as QueueJobPayloads['mail.sendSignInOtp']);
      default:
        throw new Error(`Unsupported queue job: ${job.name}`);
    }
  }
}
