import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { apiGet } from '../lib/http.js';

export async function healthHandler(
  args: Record<string, unknown>,
): Promise<CallToolResult> {
  const baseUrl = (args.baseUrl as string | undefined) ?? 'http://localhost:4000';
  const data = await apiGet(`${baseUrl}/api/v1/health`);
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}
