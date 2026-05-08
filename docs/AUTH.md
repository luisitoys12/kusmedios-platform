# KusMedios — Sistema de Autenticación

## Arquitectura

El sistema de auth usa **JWT con access + refresh tokens** siguiendo el patrón de rotación segura:

- **Access Token**: expira en 15 minutos, enviado en `Authorization: Bearer <token>`
- **Refresh Token**: expira en 7 días, almacenado como hash bcrypt en el store de usuarios
- **Rotación**: cada `/auth/refresh` invalida el refresh anterior y emite uno nuevo

## Roles y Permisos

| Rol | Acceso |
|---|---|
| `admin` | Todo el sistema, gestión de usuarios, tenants, facturación |
| `operator` | Gestión de canales, programación, monitoreo |
| `client` | Solo su tenant: canales propios, estadísticas, configuración |

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | Público | Registro de nuevo usuario |
| `POST` | `/auth/login` | Público | Login, retorna access + refresh token |
| `POST` | `/auth/refresh` | Refresh Token | Rota tokens |
| `POST` | `/auth/logout` | Access Token | Invalida refresh token |
| `GET` | `/auth/me` | Access Token | Datos del usuario autenticado |
| `GET` | `/auth/admin-only` | Admin | Ruta de ejemplo protegida |

## Cuentas Demo

| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin@kusmedios.com | Admin1234! |
| Operador | operador@kusmedios.com | Operador1234! |
| Cliente | cliente@demo.com | Cliente1234! |

## Protección de Rutas (NestJS)

Todas las rutas están protegidas por defecto via `APP_GUARD`.
Para marcar una ruta como pública:

```typescript
@Public()
@Post('mi-ruta-publica')
miRuta() { ... }
```

Para restringir por rol:

```typescript
@Roles('admin')
@Get('solo-admin')
soloAdmin() { ... }
```

## Migración a Prisma + PostgreSQL

El store en memoria (`users.service.ts`) está listo para intercambiarse:
1. Instalar: `pnpm add @prisma/client prisma`
2. `npx prisma init`
3. Reemplazar arrays en memoria por `this.prisma.user.findUnique(...)`, etc.
4. Configurar `DATABASE_URL` en las variables de entorno de Fly.io

## Variables de Entorno Requeridas en Producción

```
JWT_SECRET=<mínimo 32 chars aleatorios>
JWT_REFRESH_SECRET=<mínimo 32 chars aleatorios, diferente al anterior>
```

Generar con: `openssl rand -base64 48`
