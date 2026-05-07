import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private prisma: PrismaService) {}

  @Post('stream/start')
  async streamStart(@Body() body: { name: string }) {
    const ch = await this.prisma.videoChannel.findFirst({
      where: { streamKey: body.name },
    });
    if (!ch) return { ok: false };
    await this.prisma.videoChannel.update({
      where: { id: ch.id },
      data: { status: 'online' },
    });
    return { ok: true, channelId: ch.id };
  }

  @Post('stream/stop')
  async streamStop(@Body() body: { name: string }) {
    const ch = await this.prisma.videoChannel.findFirst({
      where: { streamKey: body.name },
    });
    if (!ch) return { ok: false };
    await this.prisma.videoChannel.update({
      where: { id: ch.id },
      data: { status: 'offline', currentViewers: 0 },
    });
    return { ok: true };
  }
}
