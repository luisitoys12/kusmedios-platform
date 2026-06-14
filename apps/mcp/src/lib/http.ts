/**
 * Minimal HTTP helpers for the MCP server.
 * Uses the native fetch API (Node 20+).
 */

const DEFAULT_TIMEOUT_MS = 10_000;

function authHeaders(token?: string): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export async function apiGet(
  url: string,
  token?: string,
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: authHeaders(token),
      signal: controller.signal,
    });
    const body = await res.json().catch(() => ({ status: res.status }));
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(body)}`);
    return body;
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiPost(
  url: string,
  data: unknown,
  token?: string,
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    const body = await res.json().catch(() => ({ status: res.status }));
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(body)}`);
    return body;
  } finally {
    clearTimeout(timeout);
  }
}
