import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { apiGet } from '../lib/http.js';

export async function streamsHandler(
  args: Record<string, unknown>,
): Promise<CallToolResult> {
  const baseUrl = (args.baseUrl as string | undefined) ?? 'http://localhost:4000';
  const token = args.token as string;
  const tool = args._tool as string;

  let data: unknown;
  if (tool === 'kusmedios_list_streams') {
    const status = (args.status as string | undefined) ?? 'all';
    data = await apiGet(`${baseUrl}/api/v1/streams?status=${status}`, token);
  } else {
    const streamKey = args.streamKey as string;
    data = await apiGet(`${baseUrl}/api/v1/streams/${streamKey}`, token);
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}
