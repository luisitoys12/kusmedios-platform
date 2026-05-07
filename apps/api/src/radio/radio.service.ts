import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class RadioService {
  constructor(private prisma: PrismaService) {}

  findAll(tenantId: string) {
    return this.prisma.radioChannel.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(tenantId: string, dto: CreateChannelDto) {
    const mountPoint = `/${tenantId.slice(0, 8)}-${dto.slug}`;
    return this.prisma.radioChannel.create({
      data: {
        tenantId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        bitrate: dto.bitrate ?? 128,
        format: dto.format ?? 'mp3',
        mountPoint,
        streamUrl: `${process.env.RADIO_ENGINE_URL}${mountPoint}`,
        status: 'offline',
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const ch = await this.prisma.radioChannel.findUnique({ where: { id } });
    if (!ch) throw new NotFoundException('Canal no encontrado');
    if (ch.tenantId !== tenantId) throw new ForbiddenException();
    return ch;
  }

  async start(id: string, tenantId: string) {
    const ch = await this.findOne(id, tenantId);
    return this.prisma.radioChannel.update({
      where: { id: ch.id },
      data: { status: 'starting' },
    });
  }

  async stop(id: string, tenantId: string) {
    const ch = await this.findOne(id, tenantId);
    return this.prisma.radioChannel.update({
      where: { id: ch.id },
      data: { status: 'offline', currentListeners: 0 },
    });
  }

  async getStats(id: string) {
    const ch = await this.prisma.radioChannel.findUnique({ where: { id } });
    if (!ch) throw new NotFoundException();
    return {
      channelId: id,
      status: ch.status,
      currentListeners: ch.currentListeners,
      nowPlaying: ch.nowPlaying,
    };
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.radioChannel.delete({ where: { id } });
  }
}
