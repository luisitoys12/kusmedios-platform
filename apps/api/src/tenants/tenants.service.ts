import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';

export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: PlanType;
  email: string;
  active: boolean;
  radioChannels: number;
  tvChannels: number;
  maxListeners: number;
  storageGb: number;
  createdAt: Date;
}

// Mock en memoria para la demo
let tenants: Tenant[] = [
  {
    id: 'kusmedios',
    name: 'EstacionKusMedios',
    slug: 'kusmedios',
    plan: 'enterprise',
    email: 'admin@estacionkusmedios.org',
    active: true,
    radioChannels: 3,
    tvChannels: 1,
    maxListeners: 10000,
    storageGb: 500,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'tenant-demo',
    name: 'Radio Demo',
    slug: 'radio-demo',
    plan: 'starter',
    email: 'demo@example.com',
    active: true,
    radioChannels: 1,
    tvChannels: 0,
    maxListeners: 500,
    storageGb: 20,
    createdAt: new Date(),
  },
];

@Injectable()
export class TenantsService {
  findAll(): Tenant[] {
    return tenants;
  }

  findOne(id: string): Tenant {
    const tenant = tenants.find((t) => t.id === id);
    if (!tenant) throw new NotFoundException(`Tenant ${id} no encontrado`);
    return tenant;
  }

  create(dto: CreateTenantDto): Tenant {
    const tenant: Tenant = {
      id: dto.slug,
      ...dto,
      active: true,
      radioChannels: 0,
      tvChannels: 0,
      maxListeners: dto.plan === 'pro' ? 2000 : dto.plan === 'starter' ? 500 : 100,
      storageGb: dto.plan === 'pro' ? 100 : dto.plan === 'starter' ? 20 : 5,
      createdAt: new Date(),
    };
    tenants.push(tenant);
    return tenant;
  }

  getChannels(id: string): object {
    this.findOne(id);
    return { tenantId: id, channels: [] }; // conectar con ChannelsService en producción
  }

  getStats(id: string): object {
    const tenant = this.findOne(id);
    return {
      tenantId: id,
      name: tenant.name,
      plan: tenant.plan,
      totalListeners: Math.floor(Math.random() * tenant.maxListeners),
      totalViewers: Math.floor(Math.random() * 200),
      storageUsedGb: Math.random() * tenant.storageGb * 0.4,
      storageMaxGb: tenant.storageGb,
      activeChannels: tenant.radioChannels + tenant.tvChannels,
      uptimePercent: 99.7,
      checkedAt: new Date(),
    };
  }
}
