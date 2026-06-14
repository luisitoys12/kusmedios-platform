import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { apiGet, apiPost } from '../lib/http.js';

export async function queueHandler(
  args: Record<string, unknown>,
): Promise<CallToolResult> {
  const baseUrl = (args.baseUrl as string | undefined) ?? 'http://localhost:4000';
  const token = args.token as string;
  const tool = args._tool as string;

  let data: unknown;
  if (tool === 'kusmedios_trigger_test_job') {
    const payload = (args.payload as Record<string, unknown> | undefined) ?? {};
    data = await apiPost(`${baseUrl}/api/v1/queue/test`, payload, token);
  } else {
    data = await apiGet(`${baseUrl}/api/v1/queue/stats`, token);
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}
