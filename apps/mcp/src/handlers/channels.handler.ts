import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { apiGet, apiPost } from '../lib/http.js';

export async function channelsHandler(
  args: Record<string, unknown>,
): Promise<CallToolResult> {
  const baseUrl = (args.baseUrl as string | undefined) ?? 'http://localhost:4000';
  const token = args.token as string;
  const tool = args._tool as string;

  let data: unknown;
  if (tool === 'kusmedios_create_channel') {
    const { name, slug, type, description, isPublic } = args as {
      name: string;
      slug: string;
      type: string;
      description?: string;
      isPublic?: boolean;
    };
    data = await apiPost(
      `${baseUrl}/api/v1/channels`,
      { name, slug, type, description, isPublic: isPublic ?? true },
      token,
    );
  } else {
    const type = (args.type as string | undefined) ?? 'all';
    const page = (args.page as number | undefined) ?? 1;
    const limit = (args.limit as number | undefined) ?? 20;
    data = await apiGet(
      `${baseUrl}/api/v1/channels?type=${type}&page=${page}&limit=${limit}`,
      token,
    );
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}
