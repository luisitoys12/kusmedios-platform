import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from './queue.module';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(QUEUES.TEST) private readonly testQueue: Queue,
    @InjectQueue(QUEUES.STREAM_EVENTS)
    private readonly streamEventsQueue: Queue,
    @InjectQueue(QUEUES.RADIO_SCHEDULER)
    private readonly radioSchedulerQueue: Queue,
  ) {}

  async addTestJob(data: Record<string, unknown> = {}) {
    const job = await this.testQueue.add('ping', { ...data, ts: Date.now() });
    this.logger.log(`Test job added: ${job.id}`);
    return job;
  }

  async addStreamEvent(
    event: 'publish' | 'publish_done',
    payload: Record<string, unknown>,
  ) {
    return this.streamEventsQueue.add(event, payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    });
  }

  async addRadioSchedulerJob(
    name: string,
    data: Record<string, unknown>,
    delayMs = 0,
  ) {
    return this.radioSchedulerQueue.add(name, data, { delay: delayMs });
  }

  async getQueueStats() {
    const [testCounts, streamCounts, radioCounts] = await Promise.all([
      this.testQueue.getJobCounts(),
      this.streamEventsQueue.getJobCounts(),
      this.radioSchedulerQueue.getJobCounts(),
    ]);
    return {
      [QUEUES.TEST]: testCounts,
      [QUEUES.STREAM_EVENTS]: streamCounts,
      [QUEUES.RADIO_SCHEDULER]: radioCounts,
    };
  }
}
