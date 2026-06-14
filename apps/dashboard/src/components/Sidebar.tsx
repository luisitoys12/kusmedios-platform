'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    label: 'Canales',
    href: '/dashboard/channels',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  },
  {
    label: 'Streams',
    href: '/dashboard/streams',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>,
  },
  {
    label: 'Radio',
    href: '/dashboard/radio',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  },
  {
    label: 'Media',
    href: '/dashboard/media',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 3h5v4M8 3H3v4"/></svg>,
  },
  {
    label: 'Tenants',
    href: '/dashboard/tenants',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    label: 'Configuración',
    href: '/dashboard/settings',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="KusMedios">
          <rect width="32" height="32" rx="8" fill="#01696f"/>
          <path d="M8 8h4v7l6-7h5l-7 8 7 8h-5l-6-7v7H8V8z" fill="white"/>
        </svg>
        <span className="logo-text">KusMedios</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${ active ? 'active' : '' }`}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        .sidebar { width: 220px; min-height: 100vh; background: var(--color-surface, #f9f8f5); border-right: 1px solid var(--color-border, #d4d1ca); display: flex; flex-direction: column; padding: 20px 12px; flex-shrink: 0; }
        .sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 4px 8px 20px; }
        .logo-text { font-size: 15px; font-weight: 700; color: var(--color-text, #28251d); }
        .sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--color-text-muted, #7a7974); text-decoration: none; transition: background .15s, color .15s; }
        .nav-item:hover { background: var(--color-surface-offset, #f3f0ec); color: var(--color-text, #28251d); }
        .nav-item.active { background: color-mix(in oklch, var(--color-primary, #01696f) 10%, transparent); color: var(--color-primary, #01696f); }
        .nav-item svg { flex-shrink: 0; }
      `}</style>
    </aside>
  );
}
