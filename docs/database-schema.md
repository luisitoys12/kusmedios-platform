# Esquema de Base de Datos

## Tablas Principales

```sql
-- Tenants (organizaciones/clientes)
CREATE TABLE tenants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  domain      VARCHAR(255),
  logo_url    TEXT,
  plan        VARCHAR(50) NOT NULL DEFAULT 'starter',
  status      VARCHAR(50) NOT NULL DEFAULT 'active', -- active | suspended | cancelled
  storage_used_bytes BIGINT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Usuarios
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name        VARCHAR(255),
  role        VARCHAR(50) NOT NULL DEFAULT 'viewer',
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  last_login  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Canales de Radio
CREATE TABLE radio_channels (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(100) NOT NULL,
  description     TEXT,
  logo_url        TEXT,
  bitrate         INTEGER DEFAULT 128, -- kbps
  format          VARCHAR(20) DEFAULT 'mp3', -- mp3 | aac | ogg
  mount_point     VARCHAR(100) UNIQUE NOT NULL,
  stream_url      TEXT,
  status          VARCHAR(50) DEFAULT 'offline', -- online | offline | starting
  is_autodj       BOOLEAN DEFAULT TRUE,
  autodj_volume   INTEGER DEFAULT 100,
  max_listeners   INTEGER DEFAULT 500,
  current_listeners INTEGER DEFAULT 0,
  now_playing     JSONB,
  engine_channel_id VARCHAR(255), -- ID en AzuraCast o motor interno
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- Canales de TV / Video
CREATE TABLE video_channels (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(100) NOT NULL,
  description     TEXT,
  thumbnail_url   TEXT,
  stream_key      VARCHAR(100) UNIQUE NOT NULL,
  rtmp_url        TEXT,
  hls_url         TEXT,
  status          VARCHAR(50) DEFAULT 'offline',
  resolution      VARCHAR(20) DEFAULT '1080p',
  bitrate_video   INTEGER DEFAULT 4000, -- kbps
  bitrate_audio   INTEGER DEFAULT 128,
  current_viewers INTEGER DEFAULT 0,
  dvr_enabled     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- Playlists de Radio
CREATE TABLE playlists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
  channel_id  UUID REFERENCES radio_channels(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  type        VARCHAR(50) DEFAULT 'default', -- default | jingle | schedule
  is_active   BOOLEAN DEFAULT TRUE,
  weight      INTEGER DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks / Canciones
CREATE TABLE tracks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
  playlist_id UUID REFERENCES playlists(id) ON DELETE SET NULL,
  title       VARCHAR(255) NOT NULL,
  artist      VARCHAR(255),
  album       VARCHAR(255),
  duration    INTEGER, -- segundos
  file_url    TEXT NOT NULL,
  file_size   BIGINT,
  waveform    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Programación (Schedule)
CREATE TABLE schedules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id  UUID REFERENCES radio_channels(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  day_of_week INTEGER[], -- 0=Dom, 1=Lun ... 6=Sab
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  playlist_id UUID REFERENCES playlists(id),
  is_live     BOOLEAN DEFAULT FALSE,
  dj_name     VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Planes de Servicio
CREATE TABLE plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100) NOT NULL,
  slug            VARCHAR(50) UNIQUE NOT NULL,
  price_mxn       DECIMAL(10,2) NOT NULL,
  radio_channels  INTEGER DEFAULT 1,
  video_channels  INTEGER DEFAULT 0,
  max_bitrate     INTEGER DEFAULT 128,
  storage_gb      INTEGER DEFAULT 5,
  max_listeners   INTEGER DEFAULT 500,
  white_label     BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Suscripciones
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID REFERENCES tenants(id) ON DELETE CASCADE,
  plan_id         UUID REFERENCES plans(id),
  status          VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  stripe_sub_id   VARCHAR(255),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Estadísticas (agregadas por hora)
CREATE TABLE channel_stats (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id      UUID NOT NULL,
  channel_type    VARCHAR(20) NOT NULL, -- radio | video
  hour            TIMESTAMPTZ NOT NULL,
  avg_listeners   INTEGER DEFAULT 0,
  peak_listeners  INTEGER DEFAULT 0,
  total_minutes   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, hour)
);
```
