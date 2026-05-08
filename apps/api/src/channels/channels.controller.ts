import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, Request,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('channels')
// @UseGuards(JwtAuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  findAll() {
    return this.channelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateChannelDto) {
    return this.channelsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChannelDto) {
    return this.channelsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelsService.remove(id);
  }

  // Estado en tiempo real del canal
  @Get(':id/status')
  status(@Param('id') id: string) {
    return this.channelsService.getStatus(id);
  }

  // Iniciar / detener canal
  @Post(':id/start')
  start(@Param('id') id: string) {
    return this.channelsService.start(id);
  }

  @Post(':id/stop')
  stop(@Param('id') id: string) {
    return this.channelsService.stop(id);
  }
}
