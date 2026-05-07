import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { HLSService } from './hls/hls.service';
import { FFmpegService } from './ffmpeg/ffmpeg.service';
import { StreamKeyService } from './stream-key/stream-key.service';

@Module({
  controllers: [VideoController],
  providers: [VideoService, HLSService, FFmpegService, StreamKeyService],
  exports: [VideoService],
})
export class VideoModule {}
