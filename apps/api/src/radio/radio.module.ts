import { Module } from '@nestjs/common';
import { RadioController } from './radio.controller';
import { RadioService } from './radio.service';
import { RadioEngineService } from './engine/radio-engine.service';
import { AutoDJService } from './autodj/autodj.service';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  controllers: [RadioController],
  providers: [
    RadioService,
    RadioEngineService,
    AutoDJService,
    SchedulerService,
  ],
  exports: [RadioService],
})
export class RadioModule {}
