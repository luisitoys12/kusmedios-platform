'use client';
import { useEffect, useState } from 'react';

interface ChannelStat {
  id: string;
  name: string;
  type: 'radio' | 'tv';
  status: 'online' | 'offline' | 'starting';
  listeners: number;
  bitrate?: number;
  nowPlaying?: string;
}

export default function DashboardPage() {
  const [channels, setChannels] = useState<ChannelStat[]>([
    { id: '1', name: 'RunaRadio 90.1', type: 'radio', status: 'online', listeners: 142, bitrate: 320, nowPlaying: 'Los Yonics — La Medida del Amor' },
    { id: '2', name: 'KusMedios FM', type: 'radio', status: 'online', listeners: 89, bitrate: 128, nowPlaying: 'Intocable — Lloro' },
    { id: '3', name: 'KusTV Live', type: 'tv', status: 'online', listeners: 34 },
    { id: '4', name: 'Canal Noticias', type: 'tv', status: 'offline', listeners: 0 },
  ]);

  const totalListeners = channels.reduce((s, c) => s + c.listeners, 0);
  const onlineChannels = channels.filter(c => c.status === 'online').length;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Canales activos', value: onlineChannels, total: channels.length, icon: '📡' },
          { label: 'Oyentes/viewers', value: totalListeners, icon: '👥' },
          { label: 'Clientes activos', value: 12, icon: '🏢' },
          { label: 'Almacenamiento', value: '18.4 GB', icon: '💾' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="text-2xl mb-1">{kpi.icon}</div>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            <div className="text-xs text-gray-400 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Canales */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Canales en vivo</h2>
        <div className="space-y-2">
          {channels.map(ch => (
            <div key={ch.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                ch.status === 'online' ? 'bg-green-400' : ch.status === 'starting' ? 'bg-yellow-400' : 'bg-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">{ch.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    ch.type === 'radio' ? 'bg-teal-900 text-teal-300' : 'bg-purple-900 text-purple-300'
                  }`}>{ch.type === 'radio' ? 'Radio' : 'TV'}</span>
                </div>
                {ch.nowPlaying && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">♪ {ch.nowPlaying}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-white text-sm font-medium">{ch.listeners}</div>
                <div className="text-gray-500 text-xs">oyentes</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition">Gestionar</button>
                {ch.status === 'online' ? (
                  <button className="px-3 py-1 text-xs bg-red-900 hover:bg-red-800 text-red-300 rounded-lg transition">Detener</button>
                ) : (
                  <button className="px-3 py-1 text-xs bg-green-900 hover:bg-green-800 text-green-300 rounded-lg transition">Iniciar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
