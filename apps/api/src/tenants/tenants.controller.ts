import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Get(':id/channels')
  channels(@Param('id') id: string) {
    return this.tenantsService.getChannels(id);
  }

  @Get(':id/stats')
  stats(@Param('id') id: string) {
    return this.tenantsService.getStats(id);
  }
}
