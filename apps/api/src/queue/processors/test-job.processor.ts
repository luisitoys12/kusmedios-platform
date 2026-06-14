import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES } from '../queue.module';

@Processor(QUEUES.TEST)
export class TestJobProcessor extends WorkerHost {
  private readonly logger = new Logger(TestJobProcessor.name);

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing job [${job.name}] id=${job.id}`);
    // Basic test — just logs the payload and resolves
    this.logger.debug(JSON.stringify(job.data, null, 2));
  }
}
