import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';
import {
  APP_QUEUE_NAME,
  QUEUE_JOB_NAMES,
  type QueueJobName,
  type QueueJobPayloads,
} from './queue.jobs';

@Injectable()
export class QueueService {
  constructor(@InjectQueue(APP_QUEUE_NAME) private readonly queue: Queue) {}

  private dispatch<TName extends QueueJobName>(
    name: TName,
    payload: QueueJobPayloads[TName],
    options?: JobsOptions,
  ) {
    return this.queue.add(name, payload, options);
  }

  dispatchMailSignInOtp(payload: QueueJobPayloads['mail.sendSignInOtp'], options?: JobsOptions) {
    return this.dispatch(QUEUE_JOB_NAMES.mailSendSignInOtp, payload, options);
  }
}
