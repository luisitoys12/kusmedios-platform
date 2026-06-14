import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  // ── Health ────────────────────────────────────────────────────────────────
  {
    name: 'kusmedios_health',
    description:
      'Check the health status of all KusMedios platform services (API, PostgreSQL, Redis, Nginx-RTMP).',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: {
          type: 'string',
          description: 'KusMedios API base URL. Defaults to http://localhost:4000',
        },
      },
      required: [],
    },
  },

  // ── Streams ───────────────────────────────────────────────────────────────
  {
    name: 'kusmedios_list_streams',
    description: 'List active and recent RTMP/HLS streams on the platform.',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string', description: 'API base URL' },
        token: { type: 'string', description: 'Bearer JWT token' },
        status: {
          type: 'string',
          enum: ['live', 'ended', 'all'],
          description: 'Filter by stream status. Default: all',
        },
      },
      required: ['token'],
    },
  },
  {
    name: 'kusmedios_get_stream',
    description: 'Get details of a specific stream by its stream key.',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string' },
        token: { type: 'string', description: 'Bearer JWT token' },
        streamKey: { type: 'string', description: 'Unique stream key' },
      },
      required: ['token', 'streamKey'],
    },
  },

  // ── Channels ─────────────────────────────────────────────────────────────
  {
    name: 'kusmedios_list_channels',
    description: 'List all channels for the authenticated tenant.',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string' },
        token: { type: 'string', description: 'Bearer JWT token' },
        type: {
          type: 'string',
          enum: ['radio', 'video', 'all'],
          description: 'Filter by channel type. Default: all',
        },
        page: { type: 'number', description: 'Page number (1-based)' },
        limit: { type: 'number', description: 'Results per page (max 100)' },
      },
      required: ['token'],
    },
  },
  {
    name: 'kusmedios_create_channel',
    description: 'Create a new radio or video channel.',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string' },
        token: { type: 'string' },
        name: { type: 'string', description: 'Channel display name' },
        slug: { type: 'string', description: 'URL-safe identifier' },
        type: {
          type: 'string',
          enum: ['radio', 'video'],
          description: 'Channel type',
        },
        description: { type: 'string' },
        isPublic: { type: 'boolean', description: 'Default: true' },
      },
      required: ['token', 'name', 'slug', 'type'],
    },
  },

  // ── Tenants ───────────────────────────────────────────────────────────────
  {
    name: 'kusmedios_get_tenant',
    description: 'Get information about the current tenant (organization).',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string' },
        token: { type: 'string' },
      },
      required: ['token'],
    },
  },
  {
    name: 'kusmedios_list_tenants',
    description: 'List all tenants (admin only).',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string' },
        token: { type: 'string', description: 'Admin Bearer JWT' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
      required: ['token'],
    },
  },

  // ── Queue / Jobs ──────────────────────────────────────────────────────────
  {
    name: 'kusmedios_queue_stats',
    description:
      'Get current BullMQ queue statistics (waiting, active, completed, failed jobs) for all queues.',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string' },
        token: { type: 'string' },
      },
      required: ['token'],
    },
  },
  {
    name: 'kusmedios_trigger_test_job',
    description: 'Enqueue a test job to verify the BullMQ → Redis pipeline.',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string' },
        token: { type: 'string' },
        payload: {
          type: 'object',
          description: 'Optional arbitrary JSON payload for the test job',
        },
      },
      required: ['token'],
    },
  },

  // ── Radio ────────────────────────────────────────────────────────────────
  {
    name: 'kusmedios_radio_now_playing',
    description: 'Get the currently playing track and metadata for a radio channel.',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string' },
        token: { type: 'string' },
        channelSlug: { type: 'string', description: 'Radio channel slug' },
      },
      required: ['token', 'channelSlug'],
    },
  },
  {
    name: 'kusmedios_radio_schedule',
    description: 'Get the broadcast schedule for a radio channel.',
    inputSchema: {
      type: 'object',
      properties: {
        baseUrl: { type: 'string' },
        token: { type: 'string' },
        channelSlug: { type: 'string' },
        date: {
          type: 'string',
          description: 'ISO 8601 date (YYYY-MM-DD). Defaults to today.',
        },
      },
      required: ['token', 'channelSlug'],
    },
  },
];
