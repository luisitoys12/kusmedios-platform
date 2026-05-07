import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding KusMedios database...');

  // Planes
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { slug: 'starter' },
      update: {},
      create: { name: 'Starter', slug: 'starter', priceMXN: 299, radioChannels: 1, videoChannels: 0, maxBitrate: 128, storageGb: 5, maxListeners: 500 },
    }),
    prisma.plan.upsert({
      where: { slug: 'pro' },
      update: {},
      create: { name: 'Pro', slug: 'pro', priceMXN: 799, radioChannels: 3, videoChannels: 1, maxBitrate: 320, storageGb: 50, maxListeners: 2000 },
    }),
    prisma.plan.upsert({
      where: { slug: 'business' },
      update: {},
      create: { name: 'Business', slug: 'business', priceMXN: 1999, radioChannels: 10, videoChannels: 3, maxBitrate: 320, storageGb: 200, maxListeners: 10000, whiteLabel: true },
    }),
  ]);
  console.log(`✅ Plans: ${plans.map(p => p.name).join(', ')}`);

  // Tenant principal KusMedios
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'kusmedios' },
    update: {},
    create: { name: 'EstacionKusMedios', slug: 'kusmedios', domain: 'estacionkusmedios.org', plan: 'business', status: 'active' },
  });
  console.log(`✅ Tenant: ${tenant.name}`);

  // Super Admin
  const hash = await bcrypt.hash('kusmedios2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@estacionkusmedios.org' },
    update: {},
    create: {
      email: 'admin@estacionkusmedios.org',
      passwordHash: hash,
      name: 'Luis Martinez',
      role: 'super_admin',
      tenantId: tenant.id,
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // Canal de radio demo
  const radioChannel = await prisma.radioChannel.upsert({
    where: { mountPoint: '/kusmedios-runaradio' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'RunaRadio 90.1',
      slug: 'runaradio-901',
      description: 'La radio comunitaria de Irapuato',
      bitrate: 320,
      format: 'mp3',
      mountPoint: '/kusmedios-runaradio',
      streamUrl: 'http://localhost:8000/kusmedios-runaradio',
      status: 'offline',
      isAutoDJ: true,
    },
  });
  console.log(`✅ Radio: ${radioChannel.name}`);

  // Canal de TV demo
  const videoChannel = await prisma.videoChannel.upsert({
    where: { streamKey: 'demo-kustv-stream-key-001' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'KusTV Live',
      slug: 'kustv-live',
      description: 'Canal de televisión EstacionKusMedios',
      streamKey: 'demo-kustv-stream-key-001',
      rtmpUrl: 'rtmp://localhost:1935/live/demo-kustv-stream-key-001',
      hlsUrl: 'http://localhost:8080/hls/demo-kustv-stream-key-001/index.m3u8',
      resolution: '1080p',
      status: 'offline',
    },
  });
  console.log(`✅ TV: ${videoChannel.name}`);

  console.log('\n🎉 Seed completo!');
  console.log('👤 Login: admin@estacionkusmedios.org / kusmedios2024!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
