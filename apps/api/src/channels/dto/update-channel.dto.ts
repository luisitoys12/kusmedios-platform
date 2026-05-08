export class UpdateChannelDto {
  name?: string;
  slug?: string;
  streamUrl?: string;
  hlsUrl?: string;
  status?: 'online' | 'offline' | 'error';
  listeners?: number;
  viewers?: number;
  bitrate?: number;
}
