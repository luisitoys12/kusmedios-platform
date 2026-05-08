import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EstacionKusMedios — Radio & TV Streaming',
  description: 'Plataforma de streaming de radio y TV en vivo. AutoDJ 24/7, HLS live, dashboard multi-tenant. EstacionKusMedios, Irapuato GTO.',
  keywords: ['radio streaming', 'tv en vivo', 'estacion kusmedios', 'azuracast', 'hls'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
