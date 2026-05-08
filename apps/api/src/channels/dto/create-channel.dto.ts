export class CreateChannelDto {
  name: string;
  slug: string;
  type: 'radio' | 'tv';
  tenantId: string;
  streamUrl?: string;
  hlsUrl?: string;
}
