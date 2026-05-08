# EstacionKusMedios — Guía de VPS y Demo en Fly.io

**Plataforma:** KusMedios Streaming Platform  
**Contexto:** Nada corriendo actualmente. Infraestructura nueva desde cero.  
**Objetivo:** Seleccionar VPS para producción y preparar demo en Fly.io.

---

## 1. Recomendaciones de VPS para Producción

La plataforma KusMedios requiere recursos diferenciados por capa. La estrategia recomendada es **separar cargas desde el inicio**, aunque al principio se puedan consolidar en uno o dos nodos.

### Requisitos mínimos por capa

| Capa | CPU | RAM | Disco | Ancho de banda |
|---|---|---|---|---|
| Radio Engine (AzuraCast/LibreTime) | 2 vCPU | 4–8 GB | 50–100 GB SSD | 1–5 TB/mes |
| Video / FFmpeg / NGINX RTMP | 4 vCPU | 8–16 GB | 100 GB SSD | 5–20 TB/mes |
| API Backend + DB (PostgreSQL) | 2 vCPU | 4–8 GB | 50 GB SSD | 2 TB/mes |
| Frontend (Next.js / static) | 1 vCPU | 1–2 GB | 20 GB SSD | 1 TB/mes |
| **Total MVP consolidado** | **4–8 vCPU** | **8–16 GB** | **200 GB SSD** | **10–30 TB/mes** |

> Para el MVP se puede usar **un solo VPS grande** (4 vCPU / 8 GB RAM / 200 GB SSD) con Docker Compose.

---

### Opciones recomendadas

#### ⭐ Hetzner Cloud (Mejor relación precio/potencia)

| Plan | CPU | RAM | Disco | Precio/mes |
|---|---|---|---|---|
| CX32 | 4 vCPU | 8 GB | 80 GB NVMe | ~$12 USD |
| CX42 | 8 vCPU | 16 GB | 160 GB NVMe | ~$22 USD |
| CCX23 (dedicado) | 4 vCPU | 16 GB | 160 GB NVMe | ~$55 USD |

https://www.hetzner.com/cloud

#### Contabo (Máximo recurso por precio bajo)

| Plan | CPU | RAM | Disco | Precio/mes |
|---|---|---|---|---|
| VPS S SSD | 4 vCPU | 8 GB | 200 GB SSD | ~$6–8 USD |
| VPS M SSD | 6 vCPU | 16 GB | 400 GB SSD | ~$12–15 USD |

https://contabo.com

#### DigitalOcean / Linode (Confiabilidad y ecosistema)

| Plan | CPU | RAM | Disco | Precio/mes |
|---|---|---|---|---|
| Droplet 4 GB | 2 vCPU | 4 GB | 80 GB SSD | ~$24 USD |
| Droplet 8 GB | 4 vCPU | 8 GB | 160 GB SSD | ~$48 USD |

https://digitalocean.com

#### OVHcloud (datacenter en Miami)

| Plan | CPU | RAM | Disco | Precio/mes |
|---|---|---|---|---|
| Essential 8 GB | 4 vCPU | 8 GB | 160 GB NVMe | ~$20 USD |

https://ovhcloud.com

---

### Decisión recomendada

| Fase | VPS | Justificación |
|---|---|---|
| **MVP** | Hetzner CX42 (~$22/mes) | 8 vCPU + 16 GB + 160 GB NVMe. Todo dockerizado. |
| **Crecimiento** | CX42 + CCX23 para video | Separar FFmpeg/RTMP. |
| **Escala** | Hetzner + BunnyCDN | HLS desde edge nodes. |

> Agrega **BunnyCDN** (~$0.005/GB) para distribución HLS desde el día uno.

---

## 2. Demo en Fly.io

Fly.io es ideal para la demo:
- Deploy directo desde Docker.
- Región `mia` (Miami) — menor latencia desde México.
- Free tier: 3 VMs + PostgreSQL + volúmenes.
- Un solo comando para deployar.

### Servicios de la demo

| App | Stack | URL |
|---|---|---|
| `kusmedios-web` | Next.js | https://kusmedios-web.fly.dev |
| `kusmedios-api` | NestJS | https://kusmedios-api.fly.dev |
| `kusmedios-db` | PostgreSQL | interno |

> Los motores de radio/video (AzuraCast, FFmpeg) **no corren en la demo** — se simulan con datos mock.

### Costos estimados (demo)

| Recurso | Costo/mes |
|---|---|
| kusmedios-api (shared-cpu-1x / 512 MB) | $0 (free tier) |
| kusmedios-web (shared-cpu-1x / 512 MB) | $0 (free tier) |
| PostgreSQL mínimo | ~$0–3 USD |
| Volumen 10 GB | ~$1.50 USD |
| **Total** | **~$1.50–5 USD/mes** |

---

*KusMedios Streaming Platform — EstacionKusMedios, Irapuato GTO — Mayo 2026*
