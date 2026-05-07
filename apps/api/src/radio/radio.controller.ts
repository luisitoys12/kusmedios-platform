import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RadioService } from './radio.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@ApiTags('radio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('radio/channels')
export class RadioController {
  constructor(private readonly radioService: RadioService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.radioService.findAll(req.user.tenantId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateChannelDto) {
    return this.radioService.create(req.user.tenantId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.radioService.findOne(id, req.user.tenantId);
  }

  @Post(':id/start')
  start(@Param('id') id: string, @Req() req: any) {
    return this.radioService.start(id, req.user.tenantId);
  }

  @Post(':id/stop')
  stop(@Param('id') id: string, @Req() req: any) {
    return this.radioService.stop(id, req.user.tenantId);
  }

  @Get(':id/stats')
  stats(@Param('id') id: string) {
    return this.radioService.getStats(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.radioService.remove(id, req.user.tenantId);
  }
}
