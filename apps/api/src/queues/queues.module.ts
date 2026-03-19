import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { APP_QUEUE_NAME } from './queue.jobs';
import { QueueService } from './queue.service';
import { QueuesProcessor } from './queues.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: APP_QUEUE_NAME,
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 100,
        removeOnFail: 1000,
      },
    }),
    MailModule,
  ],
  providers: [QueueService, QueuesProcessor],
  exports: [QueueService],
})
export class QueuesModule {}
