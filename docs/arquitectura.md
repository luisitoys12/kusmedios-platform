# Arquitectura KusMedios Platform

## Visión General

Plataforma multi-tenant de streaming de radio y TV para EstacionKusMedios.
Opera canales propios 24/7 y permite rentar servicios a terceros.

## Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
│  Landing (Next.js)  │  Dashboard Admin  │  Portal Cliente    │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      API / BFF (NestJS)                      │
│  REST API  │  WebSocket Server  │  Job Queue (BullMQ)        │
└─────────────────────────────────────────────────────────────┘
                              │
┌────────────────────┬─────────────────────┬───────────────────┐
│   Radio Engine     │    Video Engine      │   Auth / Billing  │
│  AutoDJ, Playlists │  RTMP → HLS, FFmpeg  │  JWT, Stripe/Clip │
│  Scheduler, Jingles│  Multi-bitrate CDN   │  Tenants, RBAC    │
└────────────────────┴─────────────────────┴───────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│  PostgreSQL (Neon)  │  Redis (cache/queues)  │  R2 (assets)  │
└─────────────────────────────────────────────────────────────┘
```

## Módulos del API

### Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET  /auth/me

### Tenants (Organizaciones)
- GET    /tenants
- POST   /tenants
- GET    /tenants/:id
- PATCH  /tenants/:id
- DELETE /tenants/:id

### Canales de Radio
- GET    /radio/channels
- POST   /radio/channels
- GET    /radio/channels/:id
- PATCH  /radio/channels/:id
- DELETE /radio/channels/:id
- POST   /radio/channels/:id/start
- POST   /radio/channels/:id/stop
- GET    /radio/channels/:id/stats
- GET    /radio/channels/:id/listeners
- POST   /radio/channels/:id/playlist
- POST   /radio/channels/:id/schedule

### Canales de TV / Video
- GET    /video/channels
- POST   /video/channels
- GET    /video/channels/:id
- PATCH  /video/channels/:id
- DELETE /video/channels/:id
- POST   /video/channels/:id/start
- POST   /video/channels/:id/stop
- GET    /video/channels/:id/stream-key (regenerar)
- GET    /video/channels/:id/hls-url
- GET    /video/channels/:id/stats

### Billing
- GET    /billing/plans
- GET    /billing/subscriptions
- POST   /billing/subscriptions
- DELETE /billing/subscriptions/:id
- GET    /billing/invoices

### Usuarios
- GET    /users
- GET    /users/:id
- PATCH  /users/:id
- DELETE /users/:id
- POST   /users/:id/roles

### Webhooks
- POST   /webhooks/stream/start
- POST   /webhooks/stream/stop

## Roles y Permisos

| Rol | Descripción |
|---|---|
| `super_admin` | Control total de la plataforma (KusMedios) |
| `tenant_admin` | Admin de su organización/tenant |
| `operator` | Opera canales, sube playlists, programa shows |
| `viewer` | Solo lectura de stats y reportes |

## Multi-Tenant

Cada cliente es un **tenant**. Los tenants tienen:
- Canales propios (aislados)
- Usuarios propios con roles
- Almacenamiento asignado
- Límites según plan
- Subdominio o dominio propio (opcional)
- Branding: logo, colores, nombre

## Radio Engine

El motor de radio propio soporta:
- **AutoDJ**: reproduce playlists automáticamente 24/7
- **Scheduler**: programa shows en horarios específicos
- **Live takeover**: DJ conecta vía Icecast/SHOUTcast y toma control
- **Fallback**: si el live cae, retoma AutoDJ automáticamente
- **Jingles**: inserta jingles automáticamente entre canciones
- **Crossfade**: transición suave entre tracks
- **Metadatos**: Now Playing vía WebSocket en tiempo real
- **Estadísticas**: listeners activos, historial, peak hours

## Video Engine

- **Ingest**: RTMP o SRT desde OBS, vmix, hardware encoders
- **Transcoding**: FFmpeg multi-bitrate (1080p, 720p, 480p, 360p)
- **Packaging**: HLS con segmentos de 3s, playlist dinámica
- **DVR**: grabación continua opcional
- **VOD**: clips del live stream para replay
- **Player**: player embebible propio con controles personalizables
- **CDN**: distribución vía Cloudflare o BunnyCDN

## Roadmap

### Fase 1 — MVP (2 meses)
- [ ] Auth, tenants, RBAC
- [ ] Dashboard admin básico
- [ ] Radio engine básico (AutoDJ + Icecast)
- [ ] Video HLS básico (RTMP ingest)
- [ ] Landing comercial
- [ ] Billing manual

### Fase 2 — Producto (2 meses)
- [ ] Portal cliente completo
- [ ] Scheduler radio y TV
- [ ] Stats en tiempo real (WebSocket)
- [ ] Billing automatizado (Stripe/Clip)
- [ ] Player embebible branded
- [ ] White-label básico

### Fase 3 — Escala (2 meses)
- [ ] Multi-bitrate automático
- [ ] CDN propia
- [ ] API pública para integraciones
- [ ] App móvil (React Native)
- [ ] Kubernetes + auto-scaling
- [ ] SLA 99.9% uptime
