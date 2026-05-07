'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: '⬛', label: 'Inicio' },
  { href: '/dashboard/radio', icon: '📻', label: 'Radio' },
  { href: '/dashboard/tv', icon: '📺', label: 'Televisión' },
  { href: '/dashboard/playlists', icon: '🎵', label: 'Playlists' },
  { href: '/dashboard/schedule', icon: '📅', label: 'Programación' },
  { href: '/dashboard/clients', icon: '🏢', label: 'Clientes' },
  { href: '/dashboard/billing', icon: '💳', label: 'Facturación' },
  { href: '/dashboard/stats', icon: '📊', label: 'Estadísticas' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'Configuración' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#4f98a3" strokeWidth="2"/>
            <path d="M11 10 L11 22 L22 16 Z" fill="#4f98a3"/>
            <circle cx="24" cy="10" r="4" fill="#01696f"/>
          </svg>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">KusMedios</div>
            <div className="text-gray-500 text-xs">Media Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? 'bg-teal-900/50 text-teal-300'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-teal-700 flex items-center justify-center text-xs text-white font-bold">L</div>
          <div>
            <div className="text-white text-xs font-medium">Luis Martinez</div>
            <div className="text-gray-500 text-xs">Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
