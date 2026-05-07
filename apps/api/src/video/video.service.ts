import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoChannelDto } from './dto/create-video-channel.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  findAll(tenantId: string) {
    return this.prisma.videoChannel.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(tenantId: string, dto: CreateVideoChannelDto) {
    const streamKey = randomBytes(16).toString('hex');
    const rtmpUrl = `${process.env.RTMP_SERVER}/${streamKey}`;
    const hlsUrl = `${process.env.HLS_BASE_URL}/${streamKey}/index.m3u8`;

    return this.prisma.videoChannel.create({
      data: {
        tenantId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        streamKey,
        rtmpUrl,
        hlsUrl,
        resolution: dto.resolution ?? '1080p',
        bitrateVideo: dto.bitrateVideo ?? 4000,
        bitrateAudio: dto.bitrateAudio ?? 128,
        status: 'offline',
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const ch = await this.prisma.videoChannel.findUnique({ where: { id } });
    if (!ch) throw new NotFoundException('Canal no encontrado');
    if (ch.tenantId !== tenantId) throw new ForbiddenException();
    return ch;
  }

  async getStreamKey(id: string, tenantId: string) {
    const ch = await this.findOne(id, tenantId);
    return { streamKey: ch.streamKey, rtmpUrl: ch.rtmpUrl };
  }

  async regenerateStreamKey(id: string, tenantId: string) {
    const ch = await this.findOne(id, tenantId);
    const streamKey = randomBytes(16).toString('hex');
    return this.prisma.videoChannel.update({
      where: { id: ch.id },
      data: {
        streamKey,
        rtmpUrl: `${process.env.RTMP_SERVER}/${streamKey}`,
        hlsUrl: `${process.env.HLS_BASE_URL}/${streamKey}/index.m3u8`,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.videoChannel.delete({ where: { id } });
  }
}
