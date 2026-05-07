import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VideoService } from './video.service';
import { CreateVideoChannelDto } from './dto/create-video-channel.dto';

@ApiTags('video')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('video/channels')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.videoService.findAll(req.user.tenantId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateVideoChannelDto) {
    return this.videoService.create(req.user.tenantId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.videoService.findOne(id, req.user.tenantId);
  }

  @Get(':id/stream-key')
  getStreamKey(@Param('id') id: string, @Req() req: any) {
    return this.videoService.getStreamKey(id, req.user.tenantId);
  }

  @Post(':id/regenerate-key')
  regenerateKey(@Param('id') id: string, @Req() req: any) {
    return this.videoService.regenerateStreamKey(id, req.user.tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.videoService.remove(id, req.user.tenantId);
  }
}
