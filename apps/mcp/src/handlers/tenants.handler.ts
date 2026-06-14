import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { apiGet } from '../lib/http.js';

export async function tenantsHandler(
  args: Record<string, unknown>,
): Promise<CallToolResult> {
  const baseUrl = (args.baseUrl as string | undefined) ?? 'http://localhost:4000';
  const token = args.token as string;
  const tool = args._tool as string;

  let data: unknown;
  if (tool === 'kusmedios_list_tenants') {
    const page = (args.page as number | undefined) ?? 1;
    const limit = (args.limit as number | undefined) ?? 20;
    data = await apiGet(
      `${baseUrl}/api/v1/tenants?page=${page}&limit=${limit}`,
      token,
    );
  } else {
    data = await apiGet(`${baseUrl}/api/v1/tenants/me`, token);
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}
