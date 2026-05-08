"use client";
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Channel {
  id: string;
  name: string;
  slug: string;
  type: 'radio' | 'tv';
  status: 'online' | 'offline' | 'error';
  listeners: number;
  viewers: number;
  bitrate: number;
  streamUrl?: string;
  hlsUrl?: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    online: 'bg-green-500/15 text-green-400 border-green-500/20',
    offline: 'bg-white/5 text-white/40 border-white/10',
    error: 'bg-red-500/15 text-red-400 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${styles[status] ?? styles.offline}`}>
      {status === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/channels`)
      .then((r) => r.json())
      .then((data) => { setChannels(data); setLoading(false); })
      .catch(() => {
        // Fallback mock si la API no está disponible
        setChannels([
          { id: '1', name: 'RunaRadio 89.9', slug: 'runaradio', type: 'radio', status: 'online', listeners: 142, viewers: 0, bitrate: 128 },
          { id: '2', name: 'KusTV Live', slug: 'kustv', type: 'tv', status: 'online', listeners: 0, viewers: 87, bitrate: 3500 },
          { id: '3', name: 'Radio Demo Cliente', slug: 'radio-demo', type: 'radio', status: 'offline', listeners: 0, viewers: 0, bitrate: 128 },
        ]);
        setLoading(false);
      });
  }, []);

  const totalListeners = channels.reduce((s, c) => s + c.listeners, 0);
  const totalViewers = channels.reduce((s, c) => s + c.viewers, 0);
  const onlineChannels = channels.filter((c) => c.status === 'online').length;

  const toggleChannel = async (channel: Channel) => {
    const action = channel.status === 'online' ? 'stop' : 'start';
    try {
      const res = await fetch(`${API_URL}/channels/${channel.id}/${action}`, { method: 'POST' });
      const updated = await res.json();
      setChannels((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === channel.id ? { ...c, status: action === 'start' ? 'online' : 'offline' } : c
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-56 bg-[#151515] border-r border-white/5 flex flex-col">
        <div className="px-5 py-5 border-b border-white/5">
          <span className="text-sm font-semibold">Estacion<span className="text-teal-400">KusMedios</span></span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 text-sm">
          {[
            ['Canales', '/dashboard', '◈'],
            ['Radio', '/dashboard/radio', '📻'],
            ['TV', '/dashboard/tv', '📺'],
            ['Clientes', '/dashboard/tenants', '🏢'],
            ['Analíticas', '/dashboard/analytics', '📊'],
            ['Planes', '/dashboard/plans', '💳'],
            ['Ajustes', '/dashboard/settings', '⚙'],
          ].map(([label, href, icon]) => (
            <a key={href} href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors">
              <span className="text-base">{icon}</span> {label}
            </a>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/5">
          <div className="text-xs text-white/30">Admin</div>
          <div className="text-sm text-white/70 font-medium">luisitoys12</div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-white/40 mt-0.5">Vista general de canales y actividad</p>
          </div>
          <button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-black text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Nuevo canal
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Canales activos', value: loading ? '—' : onlineChannels, unit: `/ ${channels.length}`, color: 'text-teal-400' },
            { label: 'Oyentes radio', value: loading ? '—' : totalListeners.toLocaleString(), unit: 'en vivo', color: 'text-white' },
            { label: 'Viewers TV', value: loading ? '—' : totalViewers.toLocaleString(), unit: 'en vivo', color: 'text-white' },
            { label: 'Uptime', value: '99.9%', unit: 'últimos 30 días', color: 'text-green-400' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
              <div className="text-xs text-white/40 mb-2">{kpi.label}</div>
              <div className={`text-2xl font-bold tabular-nums ${kpi.color}`}>{kpi.value}</div>
              <div className="text-xs text-white/30 mt-1">{kpi.unit}</div>
            </div>
          ))}
        </div>

        {/* Channels table */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-medium">Canales</h2>
            <span className="text-xs text-white/30">{channels.length} canales</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-white/30 text-sm">Cargando canales...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Canal', 'Tipo', 'Estado', 'Oyentes/Viewers', 'Bitrate', 'Acciones'].map((h) => (
                    <th key={h} className="text-left text-xs text-white/30 font-medium px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {channels.map((ch) => (
                  <tr key={ch.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{ch.name}</div>
                      <div className="text-xs text-white/30">{ch.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-white/50 uppercase tracking-wider">{ch.type}</span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={ch.status} /></td>
                    <td className="px-6 py-4 tabular-nums text-white/70">
                      {ch.type === 'radio' ? `${ch.listeners} oyentes` : `${ch.viewers} viewers`}
                    </td>
                    <td className="px-6 py-4 tabular-nums text-white/50">{ch.bitrate} kbps</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleChannel(ch)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          ch.status === 'online'
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            : 'border-teal-500/30 text-teal-400 hover:bg-teal-500/10'
                        }`}>
                        {ch.status === 'online' ? 'Detener' : 'Iniciar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
