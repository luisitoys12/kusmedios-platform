import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { TestJobProcessor } from './processors/test-job.processor';

export const QUEUES = {
  TEST: 'test',
  STREAM_EVENTS: 'stream-events',
  RADIO_SCHEDULER: 'radio-scheduler',
} as const;

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          url: process.env.REDIS_URL ?? 'redis://localhost:6379',
        },
      }),
    }),
    BullModule.registerQueue(
      { name: QUEUES.TEST },
      { name: QUEUES.STREAM_EVENTS },
      { name: QUEUES.RADIO_SCHEDULER },
    ),
  ],
  providers: [QueueService, TestJobProcessor],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
