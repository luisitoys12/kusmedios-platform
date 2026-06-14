'use client';
import { useState, useMemo } from 'react';

type Platform = 'youtube' | 'vimeo' | 'twitch' | 'soundcloud' | 'spotify' | 'raw' | null;

function detectPlatform(url: string): Platform {
  if (!url) return null;
  try { new URL(url); } catch { return null; }
  if (/youtu\.be|youtube\.com/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url)) return 'vimeo';
  if (/twitch\.tv/.test(url)) return 'twitch';
  if (/soundcloud\.com/.test(url)) return 'soundcloud';
  if (/open\.spotify\.com/.test(url)) return 'spotify';
  if (/\.(mp4|webm|ogg|mp3|wav|flac)$/i.test(url)) return 'raw';
  return null;
}

function buildEmbedUrl(url: string, platform: Platform): string | null {
  try {
    switch (platform) {
      case 'youtube': {
        const u = new URL(url);
        const id = u.searchParams.get('v') || u.pathname.split('/').pop() || '';
        return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`;
      }
      case 'vimeo': {
        const id = new URL(url).pathname.replace(/\//g, '');
        return `https://player.vimeo.com/video/${id}?title=0&byline=0`;
      }
      case 'twitch': {
        const parts = new URL(url).pathname.split('/').filter(Boolean);
        const channel = parts[0];
        return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
      }
      case 'soundcloud':
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%234f98a3&auto_play=false&visual=true`;
      case 'spotify': {
        const path = new URL(url).pathname;
        return `https://open.spotify.com/embed${path}`;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

const PLATFORM_LABELS: Record<string, string> = {
  youtube: 'YouTube', vimeo: 'Vimeo', twitch: 'Twitch',
  soundcloud: 'SoundCloud', spotify: 'Spotify', raw: 'Archivo directo',
};

const PRESETS = [
  { label: 'YouTube', placeholder: 'https://www.youtube.com/watch?v=...' },
  { label: 'Vimeo', placeholder: 'https://vimeo.com/...' },
  { label: 'SoundCloud', placeholder: 'https://soundcloud.com/...' },
  { label: 'Spotify', placeholder: 'https://open.spotify.com/episode/...' },
  { label: 'Twitch', placeholder: 'https://www.twitch.tv/...' },
  { label: 'MP4 / MP3 directo', placeholder: 'https://cdn.ejemplo.com/audio.mp3' },
];

export function MediaEmbed() {
  const [url, setUrl] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [placeholder, setPlaceholder] = useState(PRESETS[0].placeholder);
  const [aspectRatio, setAspectRatio] = useState<'16/9' | '9/16' | '1/1'>('16/9');

  const platform = useMemo(() => detectPlatform(submitted), [submitted]);
  const embedUrl = useMemo(() => platform ? buildEmbedUrl(submitted, platform) : null, [submitted, platform]);
  const isRaw = platform === 'raw';

  const submit = () => { if (url.trim()) setSubmitted(url.trim()); };

  return (
    <div className="embed-wrap">
      {/* Preset chips */}
      <div className="preset-chips">
        {PRESETS.map(p => (
          <button
            key={p.label}
            className="chip"
            onClick={() => { setPlaceholder(p.placeholder); }}
          >{p.label}</button>
        ))}
      </div>

      {/* URL input */}
      <div className="embed-input-row">
        <input
          className="embed-input"
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder={placeholder}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        <button className="embed-btn" onClick={submit}>Embed</button>
      </div>

      {platform && (
        <div className="platform-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
          Detectado: <strong>{PLATFORM_LABELS[platform]}</strong>
        </div>
      )}

      {/* Aspect ratio picker */}
      {submitted && (
        <div className="ratio-picker">
          <span>Relación:</span>
          {(['16/9', '9/16', '1/1'] as const).map(r => (
            <button
              key={r}
              className={`ratio-btn ${ aspectRatio === r ? 'active' : '' }`}
              onClick={() => setAspectRatio(r)}
            >{r}</button>
          ))}
        </div>
      )}

      {/* Player */}
      {submitted && (
        <div className="embed-player" style={{ aspectRatio }}>
          {isRaw ? (
            /\.(mp4|webm|ogg)$/i.test(submitted)
              ? <video src={submitted} controls className="raw-media" playsInline />
              : <audio src={submitted} controls className="raw-audio" />
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              className="embed-iframe"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              title="Media embed"
            />
          ) : (
            <p className="embed-error">No se pudo generar el embed para esta URL.</p>
          )}
        </div>
      )}

      <style>{`
        .embed-wrap { display: flex; flex-direction: column; gap: 14px; }
        .preset-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .chip { padding: 4px 12px; border-radius: 99px; border: 1px solid var(--color-border, #d4d1ca); background: var(--color-surface, #f9f8f5); font-size: 12px; cursor: pointer; transition: all .15s; color: var(--color-text, #28251d); }
        .chip:hover { border-color: var(--color-primary, #01696f); color: var(--color-primary, #01696f); }
        .embed-input-row { display: flex; gap: 8px; }
        .embed-input { flex: 1; padding: 9px 14px; border-radius: 8px; border: 1px solid var(--color-border, #d4d1ca); background: var(--color-surface, #f9f8f5); font-size: 14px; transition: border-color .15s; }
        .embed-input:focus { outline: none; border-color: var(--color-primary, #01696f); }
        .embed-btn { padding: 9px 20px; background: var(--color-primary, #01696f); color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: background .15s; }
        .embed-btn:hover { background: var(--color-primary-hover, #0c4e54); }
        .platform-badge { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--color-text-muted, #7a7974); }
        .platform-badge svg { color: var(--color-primary, #01696f); }
        .ratio-picker { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--color-text-muted, #7a7974); }
        .ratio-btn { padding: 3px 10px; border-radius: 6px; border: 1px solid var(--color-border, #d4d1ca); background: transparent; font-size: 12px; cursor: pointer; transition: all .15s; }
        .ratio-btn.active { background: var(--color-primary, #01696f); color: #fff; border-color: var(--color-primary, #01696f); }
        .embed-player { width: 100%; background: #000; border-radius: 10px; overflow: hidden; }
        .embed-iframe { width: 100%; height: 100%; border: none; display: block; }
        .raw-media { width: 100%; height: 100%; object-fit: contain; display: block; }
        .raw-audio { width: 100%; margin: auto; display: block; }
        .embed-error { color: var(--color-error, #a12c7b); font-size: 13px; padding: 16px; text-align: center; }
      `}</style>
    </div>
  );
}
