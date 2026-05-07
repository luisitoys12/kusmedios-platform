import { IsString, IsOptional, IsInt, IsIn, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoChannelDto {
  @ApiProperty({ example: 'KusTV Live' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'kustv-live' })
  @IsString()
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['1080p', '720p', '480p'], required: false })
  @IsOptional()
  @IsIn(['1080p', '720p', '480p'])
  resolution?: string;

  @ApiProperty({ example: 4000, required: false })
  @IsOptional()
  @IsInt()
  bitrateVideo?: number;

  @ApiProperty({ example: 128, required: false })
  @IsOptional()
  @IsInt()
  bitrateAudio?: number;
}
