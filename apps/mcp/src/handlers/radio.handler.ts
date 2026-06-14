import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { apiGet } from '../lib/http.js';

export async function radioHandler(
  args: Record<string, unknown>,
): Promise<CallToolResult> {
  const baseUrl = (args.baseUrl as string | undefined) ?? 'http://localhost:4000';
  const token = args.token as string;
  const tool = args._tool as string;
  const channelSlug = args.channelSlug as string;

  let data: unknown;
  if (tool === 'kusmedios_radio_now_playing') {
    data = await apiGet(
      `${baseUrl}/api/v1/radio/${channelSlug}/now-playing`,
      token,
    );
  } else {
    const date =
      (args.date as string | undefined) ??
      new Date().toISOString().split('T')[0];
    data = await apiGet(
      `${baseUrl}/api/v1/radio/${channelSlug}/schedule?date=${date}`,
      token,
    );
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}
