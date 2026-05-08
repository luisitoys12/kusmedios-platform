const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('km_access');
}

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('km_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const token2 = getAccessToken();
      return fetch(`${API}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token2}`,
          ...(options.headers || {}),
        },
      });
    } else {
      logout();
      if (typeof window !== 'undefined') window.location.href = '/(auth)/login';
    }
  }
  return res;
}

async function tryRefresh(): Promise<boolean> {
  const refresh = typeof window !== 'undefined' ? localStorage.getItem('km_refresh') : null;
  if (!refresh) return false;
  try {
    const res = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${refresh}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('km_access', data.accessToken);
    localStorage.setItem('km_refresh', data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('km_access');
  localStorage.removeItem('km_refresh');
  localStorage.removeItem('km_user');
}
