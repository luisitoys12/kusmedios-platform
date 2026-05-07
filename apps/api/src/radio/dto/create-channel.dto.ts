import { IsString, IsOptional, IsInt, IsIn, Min, Max, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ example: 'RunaRadio FM' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'runaradio-fm' })
  @IsString()
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 128, required: false })
  @IsOptional()
  @IsInt()
  @Min(32)
  @Max(320)
  bitrate?: number;

  @ApiProperty({ enum: ['mp3', 'aac', 'ogg'], required: false })
  @IsOptional()
  @IsIn(['mp3', 'aac', 'ogg'])
  format?: string;
}
