import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { healthHandler } from './health.handler.js';
import { streamsHandler } from './streams.handler.js';
import { channelsHandler } from './channels.handler.js';
import { tenantsHandler } from './tenants.handler.js';
import { queueHandler } from './queue.handler.js';
import { radioHandler } from './radio.handler.js';

type Handler = (args: Record<string, unknown>) => Promise<CallToolResult>;

const HANDLERS: Record<string, Handler> = {
  kusmedios_health: healthHandler,
  kusmedios_list_streams: streamsHandler,
  kusmedios_get_stream: streamsHandler,
  kusmedios_list_channels: channelsHandler,
  kusmedios_create_channel: channelsHandler,
  kusmedios_get_tenant: tenantsHandler,
  kusmedios_list_tenants: tenantsHandler,
  kusmedios_queue_stats: queueHandler,
  kusmedios_trigger_test_job: queueHandler,
  kusmedios_radio_now_playing: radioHandler,
  kusmedios_radio_schedule: radioHandler,
};

export async function dispatch(
  toolName: string,
  args: Record<string, unknown>,
): Promise<CallToolResult> {
  const handler = HANDLERS[toolName];
  if (!handler) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: `Unknown tool: ${toolName}` }),
        },
      ],
      isError: true,
    };
  }
  try {
    return await handler({ ...args, _tool: toolName });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
      isError: true,
    };
  }
}
