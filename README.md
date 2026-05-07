# 🎙️ KusMedios Platform

Plataforma propia de streaming de **Radio & TV 24/7** para EstacionKusMedios.
Opera canales propios y renta servicios gestionados a terceros.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend marketing | Next.js 14 + Tailwind |
| Dashboard admin/cliente | Next.js 14 App Router |
| API / BFF | NestJS (Node.js) |
| Auth | JWT + Refresh + RBAC + Tenants |
| Base de datos | PostgreSQL (Neon) |
| Realtime | WebSockets (Socket.io) |
| Cola/jobs | Redis + BullMQ |
| Radio engine | AzuraCast API wrapper → propio |
| Video engine | FFmpeg + Nginx RTMP + HLS |
| Storage | S3-compatible (Cloudflare R2) |
| Observabilidad | Prometheus + Grafana |
| Infra | Docker Compose → Kubernetes |

## Módulos

- `apps/web` — Landing comercial (Next.js)
- `apps/dashboard` — Dashboard admin + cliente (Next.js)
- `apps/api` — Backend REST + WebSocket (NestJS)
- `apps/radio-engine` — Motor radio propio (AutoDJ, playlists, scheduler)
- `apps/video-engine` — Motor video HLS (RTMP ingest, empaquetado, CDN)
- `packages/ui` — Design system compartido
- `packages/db` — Prisma schema + migraciones
- `packages/config` — Configs compartidas (eslint, tsconfig)
- `infra/` — Docker Compose, Nginx, configs de infra
- `docs/` — Arquitectura, ADRs, API reference

## Inicio rápido

```bash
# 1. Clonar
git clone https://github.com/luisitoys12/kusmedios-platform.git
cd kusmedios-platform

# 2. Instalar dependencias
pnpm install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Levantar servicios con Docker
docker compose up -d

# 5. Correr migraciones
pnpm db:migrate

# 6. Dev mode
pnpm dev
```

## Planes de servicio

| Plan | Radio | TV | Storage | Precio |
|---|---|---|---|---|
| Starter | 1 canal 128kbps | — | 5 GB | $299 MXN/mes |
| Pro | 3 canales 320kbps | 1 canal HD | 50 GB | $799 MXN/mes |
| Business | 10 canales | 3 canales 1080p | 200 GB | $1,999 MXN/mes |
| Enterprise | Ilimitado | Ilimitado | Custom | Cotizar |

## Licencia

Propiedad de EstacionKusMedios — Irapuato, Guanajuato, MX.
