import { Controller, Get } from '@nestjs/common';

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    radioChannels: 1,
    tvChannels: 0,
    maxListeners: 100,
    storageGb: 5,
    bitrate: 64,
    features: ['1 canal de radio', '100 oyentes', '5 GB almacenamiento', 'Player embebible'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    currency: 'USD',
    radioChannels: 2,
    tvChannels: 0,
    maxListeners: 500,
    storageGb: 20,
    bitrate: 128,
    features: ['2 canales de radio', '500 oyentes', '20 GB almacenamiento', 'AutoDJ 24/7', 'Estadísticas básicas', 'SSL incluido'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    currency: 'USD',
    radioChannels: 5,
    tvChannels: 1,
    maxListeners: 2000,
    storageGb: 100,
    bitrate: 320,
    features: ['5 canales radio + 1 TV', '2,000 oyentes/viewers', '100 GB almacenamiento', 'AutoDJ + programación', 'TV HLS live', 'API access', 'Soporte prioritario'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    currency: 'USD',
    radioChannels: -1,
    tvChannels: -1,
    maxListeners: -1,
    storageGb: -1,
    bitrate: -1,
    features: ['Canales ilimitados', 'Oyentes/viewers ilimitados', 'White-label completo', 'Dominio propio', 'CDN dedicado', 'SLA 99.9%', 'Soporte 24/7'],
    popular: false,
  },
];

@Controller('plans')
export class PlansController {
  @Get()
  findAll() {
    return PLANS;
  }
}
