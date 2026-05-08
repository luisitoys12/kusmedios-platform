import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

export type ChannelType = 'radio' | 'tv';
export type ChannelStatus = 'online' | 'offline' | 'error';

export interface Channel {
  id: string;
  name: string;
  slug: string;
  type: ChannelType;
  status: ChannelStatus;
  tenantId: string;
  streamUrl?: string;
  hlsUrl?: string;
  listeners: number;
  viewers: number;
  bitrate: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock en memoria para la demo — reemplazar con Prisma en producción
let channels: Channel[] = [
  {
    id: '1',
    name: 'RunaRadio 89.9',
    slug: 'runaradio',
    type: 'radio',
    status: 'online',
    tenantId: 'kusmedios',
    streamUrl: 'https://stream.estacionkusmedios.org/runaradio',
    hlsUrl: null,
    listeners: 142,
    viewers: 0,
    bitrate: 128,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'KusTV Live',
    slug: 'kustv',
    type: 'tv',
    status: 'online',
    tenantId: 'kusmedios',
    streamUrl: null,
    hlsUrl: 'https://stream.estacionkusmedios.org/kustv/index.m3u8',
    listeners: 0,
    viewers: 87,
    bitrate: 3500,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Radio Demo Cliente',
    slug: 'radio-demo',
    type: 'radio',
    status: 'offline',
    tenantId: 'tenant-demo',
    streamUrl: null,
    hlsUrl: null,
    listeners: 0,
    viewers: 0,
    bitrate: 128,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

@Injectable()
export class ChannelsService {
  findAll(): Channel[] {
    return channels;
  }

  findOne(id: string): Channel {
    const channel = channels.find((c) => c.id === id);
    if (!channel) throw new NotFoundException(`Canal ${id} no encontrado`);
    return channel;
  }

  create(dto: CreateChannelDto): Channel {
    const channel: Channel = {
      id: Date.now().toString(),
      ...dto,
      status: 'offline',
      listeners: 0,
      viewers: 0,
      bitrate: dto.type === 'tv' ? 3500 : 128,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    channels.push(channel);
    return channel;
  }

  update(id: string, dto: UpdateChannelDto): Channel {
    const idx = channels.findIndex((c) => c.id === id);
    if (idx === -1) throw new NotFoundException(`Canal ${id} no encontrado`);
    channels[idx] = { ...channels[idx], ...dto, updatedAt: new Date() };
    return channels[idx];
  }

  remove(id: string): { message: string } {
    const idx = channels.findIndex((c) => c.id === id);
    if (idx === -1) throw new NotFoundException(`Canal ${id} no encontrado`);
    channels.splice(idx, 1);
    return { message: `Canal ${id} eliminado` };
  }

  getStatus(id: string): object {
    const channel = this.findOne(id);
    return {
      id: channel.id,
      name: channel.name,
      status: channel.status,
      listeners: channel.listeners,
      viewers: channel.viewers,
      bitrate: channel.bitrate,
      uptime: channel.status === 'online' ? Math.floor(Math.random() * 86400) : 0,
      checkedAt: new Date(),
    };
  }

  start(id: string): Channel {
    return this.update(id, { status: 'online' } as any);
  }

  stop(id: string): Channel {
    return this.update(id, { status: 'offline' } as any);
  }
}
