# @kusmedios/mcp — MCP Server (beta)

Model Context Protocol server for the KusMedios platform.  
Exposes platform capabilities as tools so AI agents (Claude, Copilot, Cursor, Continue, etc.) can interact with the platform.

## Tools disponibles

| Tool | Descripción |
|---|---|
| `kusmedios_health` | Estado de todos los servicios |
| `kusmedios_list_streams` | Listar streams activos/recientes |
| `kusmedios_get_stream` | Detalles de un stream por `streamKey` |
| `kusmedios_list_channels` | Canales del tenant |
| `kusmedios_create_channel` | Crear canal radio o video |
| `kusmedios_get_tenant` | Información del tenant actual |
| `kusmedios_list_tenants` | Listar todos los tenants (admin) |
| `kusmedios_queue_stats` | Estadísticas de colas BullMQ |
| `kusmedios_trigger_test_job` | Encolar job de prueba |
| `kusmedios_radio_now_playing` | Track actual de un canal de radio |
| `kusmedios_radio_schedule` | Programación de un canal de radio |

## Instalación

```bash
cd apps/mcp
pnpm install
pnpm dev          # desarrollo con watch
pnpm build        # compilar a dist/
pnpm start        # producción
```

## Integración con Claude Desktop / Cursor / Continue

Agrega en tu `claude_desktop_config.json` (u equivalente):

```json
{
  "mcpServers": {
    "kusmedios": {
      "command": "node",
      "args": ["/ruta/a/kusmedios-platform/apps/mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

O en dev con `tsx`:

```json
{
  "mcpServers": {
    "kusmedios": {
      "command": "npx",
      "args": ["tsx", "/ruta/a/kusmedios-platform/apps/mcp/src/index.ts"]
    }
  }
}
```

## Variables de entorno (opcional)

El servidor usa `http://localhost:4000` por defecto.  
Puedes pasar `baseUrl` directamente en el argumento de cada tool.

## Arquitectura

```
apps/mcp/
├── src/
│   ├── index.ts          # Entry point — crea Server MCP y conecta transport
│   ├── tools/index.ts    # Definiciones de todos los tools (name, description, inputSchema)
│   ├── handlers/         # Un handler por dominio
│   │   ├── health.handler.ts
│   │   ├── streams.handler.ts
│   │   ├── channels.handler.ts
│   │   ├── tenants.handler.ts
│   │   ├── queue.handler.ts
│   │   └── radio.handler.ts
│   └── lib/
│       └── http.ts       # fetch helpers con timeout y auth headers
└── README.md
```

## Estado beta

Este servidor está en **beta**. Los tools apuntan a los endpoints de la API REST de KusMedios.  
Asegúrate de que la API esté corriendo antes de usarlo:

```bash
docker compose up -d
curl localhost:4000/api/v1/health  # debe responder { status: "ok" }
```
