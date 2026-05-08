# KusMedios Platform — flyctl Deploy Commands

**Usuario GitHub:** luisitoys12 | **Org:** Estacionkusmedios  
**Región:** `mia` (Miami — menor latencia desde Irapuato, GTO)  
**Stack:** Next.js (web) + NestJS (api) + PostgreSQL + Redis

---

## 0. Prerrequisitos

```bash
# Instalar flyctl
curl -L https://fly.io/install.sh | sh
export FLYCTL_INSTALL="/home/$USER/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

fly version
fly auth login
fly auth whoami
```

---

## 1. Crear recursos base

### PostgreSQL

```bash
fly postgres create \
  --name kusmedios-db \
  --region mia \
  --initial-cluster-size 1 \
  --vm-size shared-cpu-1x \
  --volume-size 10
# ⚠️ Guarda el connection string que imprime Fly — solo aparece una vez
```

### Redis

```bash
fly redis create \
  --name kusmedios-redis \
  --region mia \
  --no-replicas
# Guarda: redis://default:<token>@<host>.upstash.io:6379
```

---

## 2. Deploy API (NestJS)

```bash
cd apps/api

# Inicializar (sin deploy)
fly launch \
  --name kusmedios-api \
  --region mia \
  --no-deploy \
  --copy-config

# Cargar secretos
fly secrets set \
  JWT_SECRET="$(openssl rand -hex 32)" \
  JWT_EXPIRES_IN="7d" \
  NODE_ENV="production" \
  REDIS_URL="redis://default:<token>@<host>.upstash.io:6379" \
  --app kusmedios-api

# Adjuntar PostgreSQL (inyecta DATABASE_URL automáticamente)
fly postgres attach kusmedios-db \
  --app kusmedios-api \
  --database-name kusmedios

# Verificar secretos
fly secrets list --app kusmedios-api

# Deploy
fly deploy --app kusmedios-api

# Verificar
fly status --app kusmedios-api
fly logs --app kusmedios-api
curl https://kusmedios-api.fly.dev/health
```

---

## 3. Deploy Frontend (Next.js)

```bash
cd apps/web

# Inicializar (sin deploy)
fly launch \
  --name kusmedios-web \
  --region mia \
  --no-deploy \
  --copy-config

# Variables de entorno
fly secrets set \
  NEXT_PUBLIC_API_URL="https://kusmedios-api.fly.dev" \
  NEXT_PUBLIC_APP_NAME="EstacionKusMedios" \
  NEXT_PUBLIC_APP_URL="https://kusmedios-web.fly.dev" \
  --app kusmedios-web

# Deploy
fly deploy --app kusmedios-web

# Verificar
fly status --app kusmedios-web
fly logs --app kusmedios-web
```

---

## 4. Dominios custom

```bash
fly certs add api.estacionkusmedios.org --app kusmedios-api
fly certs add app.estacionkusmedios.org --app kusmedios-web

# Ver estado SSL
fly certs show api.estacionkusmedios.org --app kusmedios-api
fly certs show app.estacionkusmedios.org --app kusmedios-web
```

> Agrega CNAME en tu DNS apuntando a `<app>.fly.dev`.

---

## 5. Operación diaria

```bash
# Re-deploy
cd apps/api && fly deploy --app kusmedios-api
cd apps/web && fly deploy --app kusmedios-web

# Paralelo desde raíz
fly deploy --app kusmedios-api --config apps/api/fly.toml &
fly deploy --app kusmedios-web --config apps/web/fly.toml &
wait

# Escalar
fly scale memory 1024 --app kusmedios-api
fly scale count 2 --app kusmedios-api

# Logs
fly logs --app kusmedios-api
fly logs --app kusmedios-web

# SSH
fly ssh console --app kusmedios-api

# Ver todas las apps
fly apps list | grep kusmedios

# Rollback
fly releases --app kusmedios-api
fly deploy --image <image-id> --app kusmedios-api
```

---

## 6. Migraciones DB

```bash
# Prisma
fly ssh console --app kusmedios-api \
  --command "npx prisma migrate deploy"

# Conexión local a la DB
fly proxy 5432 --app kusmedios-db
```

---

## 7. Variables de entorno — referencia

### API

| Variable | Valor ejemplo | Descripción |
|---|---|---|
| `NODE_ENV` | `production` | Entorno |
| `PORT` | `3000` | Puerto interno |
| `DATABASE_URL` | `postgres://...` | Inyectada por postgres attach |
| `REDIS_URL` | `redis://...` | Redis Upstash |
| `JWT_SECRET` | `<hex 32 bytes>` | Clave JWT |
| `JWT_EXPIRES_IN` | `7d` | TTL tokens |
| `CORS_ORIGIN` | `https://kusmedios-web.fly.dev` | Frontend permitido |

### Frontend

| Variable | Valor ejemplo | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://kusmedios-api.fly.dev` | URL de la API |
| `NEXT_PUBLIC_APP_NAME` | `EstacionKusMedios` | Nombre |
| `NEXT_PUBLIC_APP_URL` | `https://kusmedios-web.fly.dev` | URL base |

---

## 8. Checklist primer deploy

- [ ] `fly auth login` completado
- [ ] PostgreSQL `kusmedios-db` creado en `mia`
- [ ] Redis `kusmedios-redis` creado
- [ ] `fly launch` en `apps/api`
- [ ] `fly launch` en `apps/web`
- [ ] Secretos cargados en ambas apps
- [ ] `fly postgres attach` ejecutado
- [ ] `fly deploy` API → `/health` responde OK
- [ ] `fly deploy` Web → carga en `https://kusmedios-web.fly.dev`
- [ ] Migraciones corridas
- [ ] Dominios custom configurados (opcional demo)

---

*KusMedios Streaming Platform — EstacionKusMedios, Irapuato GTO*  
*Fly.io region: mia | GitHub: luisitoys12*
