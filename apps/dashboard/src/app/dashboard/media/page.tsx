'use client';
import { useState } from 'react';
import { CinemaPlayer } from '../../../components/media/CinemaPlayer';
import { PodcastUploader } from '../../../components/media/PodcastUploader';
import { MediaEmbed } from '../../../components/media/MediaEmbed';

type Tab = 'player' | 'upload' | 'embed';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'player',
    label: 'Modo Cine',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 3h5v4M8 3H3v4"/></svg>,
  },
  {
    id: 'upload',
    label: 'Subir Podcast',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  },
  {
    id: 'embed',
    label: 'Embed Externo',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
];

// Demo stream for Cinema Player tab
const DEMO_SRC = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<Tab>('player');

  return (
    <div className="media-page">
      <div className="page-header">
        <h1 className="page-title">Media</h1>
        <p className="page-subtitle">Reproduce, sube y embebe contenido desde un solo lugar.</p>
      </div>

      {/* Tabs */}
      <div className="tab-bar" role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`tab-btn ${ activeTab === t.id ? 'active' : '' }`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="tab-panel">
        {activeTab === 'player' && (
          <div>
            <p className="panel-hint">
              Usa <kbd>Space</kbd>/<kbd>K</kbd> play/pause · <kbd>C</kbd> modo cine · <kbd>F</kbd> pantalla completa · <kbd>M</kbd> silenciar · <kbd>←</kbd><kbd>→</kbd> ±10s
            </p>
            <CinemaPlayer
              src={DEMO_SRC}
              title="Demo — Big Buck Bunny (reemplaza con tu stream HLS o archivo)"
              type="video"
            />
          </div>
        )}

        {activeTab === 'upload' && <PodcastUploader />}

        {activeTab === 'embed' && <MediaEmbed />}
      </div>

      <style>{`
        .media-page { padding: 28px 32px; max-width: 960px; }
        @media (max-width: 640px) { .media-page { padding: 16px; } }
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: clamp(1.5rem, 2vw, 2rem); font-weight: 700; color: var(--color-text, #28251d); margin-bottom: 4px; }
        .page-subtitle { font-size: 14px; color: var(--color-text-muted, #7a7974); }
        .tab-bar { display: flex; gap: 4px; border-bottom: 1px solid var(--color-border, #d4d1ca); margin-bottom: 24px; }
        .tab-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; border: none; border-bottom: 2px solid transparent; background: none; font-size: 14px; font-weight: 500; color: var(--color-text-muted, #7a7974); cursor: pointer; transition: color .15s, border-color .15s; margin-bottom: -1px; }
        .tab-btn:hover { color: var(--color-text, #28251d); }
        .tab-btn.active { color: var(--color-primary, #01696f); border-bottom-color: var(--color-primary, #01696f); }
        .tab-panel { }
        .panel-hint { font-size: 12px; color: var(--color-text-muted, #7a7974); margin-bottom: 14px; }
        kbd { display: inline-block; padding: 1px 5px; border-radius: 4px; border: 1px solid var(--color-border, #d4d1ca); background: var(--color-surface, #f9f8f5); font-family: monospace; font-size: 11px; }
      `}</style>
    </div>
  );
}
