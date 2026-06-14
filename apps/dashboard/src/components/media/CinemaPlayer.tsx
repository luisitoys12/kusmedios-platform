'use client';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../hooks/usePlayer';

interface Props {
  src: string;
  title?: string;
  poster?: string;
  type?: 'video' | 'audio';
}

function fmt(s: number) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export function CinemaPlayer({ src, title, poster, type = 'video' }: Props) {
  const { videoRef, state, toggle, seek, toggleMute, toggleCinema, toggleFullscreen, onTimeUpdate } = usePlayer();
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide controls
  const resetHide = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      switch (e.key) {
        case ' ': case 'k': e.preventDefault(); toggle(); break;
        case 'f': case 'F': toggleFullscreen(); break;
        case 'c': case 'C': toggleCinema(); break;
        case 'm': case 'M': toggleMute(); break;
        case 'ArrowLeft': seek(-10); break;
        case 'ArrowRight': seek(10); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, seek, toggleMute, toggleCinema, toggleFullscreen]);

  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div
      className={`cinema-wrap ${
        state.cinema ? 'cinema-mode' : ''
      }`}
      onMouseMove={resetHide}
      onClick={resetHide}
    >
      {/* Backdrop for cinema mode */}
      {state.cinema && (
        <div className="cinema-backdrop" onClick={toggleCinema} />
      )}

      <div className={`cinema-player ${ state.cinema ? 'cinema-active' : '' }`}>
        {type === 'video' ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="cinema-video"
            onTimeUpdate={onTimeUpdate}
            onPlay={() => {}}
            onPause={() => {}}
            playsInline
          />
        ) : (
          <div className="audio-cinema">
            {poster && <img src={poster} alt={title} className="audio-poster" />}
            <audio ref={videoRef as React.RefObject<HTMLAudioElement>} src={src} onTimeUpdate={onTimeUpdate} />
          </div>
        )}

        {/* Controls overlay */}
        <div className={`cinema-controls ${ showControls ? 'visible' : 'hidden' }`}>
          {title && <p className="cinema-title">{title}</p>}

          {/* Progress bar */}
          <div className="progress-wrap">
            <input
              type="range" min={0} max={100} value={progress}
              className="progress-bar"
              onChange={e => {
                const v = videoRef.current;
                if (v) v.currentTime = (parseFloat(e.target.value) / 100) * v.duration;
              }}
            />
          </div>

          <div className="controls-row">
            <div className="ctrl-left">
              {/* Play/Pause */}
              <button onClick={toggle} aria-label={state.playing ? 'Pausar' : 'Reproducir'} className="ctrl-btn">
                {state.playing
                  ? <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  : <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                }
              </button>
              {/* -10 / +10 */}
              <button onClick={() => seek(-10)} aria-label="-10s" className="ctrl-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/><text x="8" y="15" fontSize="7" fill="currentColor" stroke="none">10</text></svg>
              </button>
              <button onClick={() => seek(10)} aria-label="+10s" className="ctrl-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-3.51"/><text x="8" y="15" fontSize="7" fill="currentColor" stroke="none">10</text></svg>
              </button>
              {/* Mute */}
              <button onClick={toggleMute} aria-label="Silenciar" className="ctrl-btn">
                {state.muted
                  ? <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                  : <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                }
              </button>
              <span className="cinema-time">{fmt(state.currentTime)} / {fmt(state.duration)}</span>
            </div>

            <div className="ctrl-right">
              {/* Cinema mode */}
              <button onClick={toggleCinema} aria-label="Modo cine" className={`ctrl-btn ${ state.cinema ? 'active' : '' }`}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 3h5v4M8 3H3v4"/></svg>
              </button>
              {/* Fullscreen */}
              <button onClick={toggleFullscreen} aria-label="Pantalla completa" className="ctrl-btn">
                {state.fullscreen
                  ? <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
                  : <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cinema-wrap { position: relative; width: 100%; }
        .cinema-player { position: relative; background: #000; border-radius: 10px; overflow: hidden; aspect-ratio: 16/9; width: 100%; }
        .cinema-video { width: 100%; height: 100%; object-fit: contain; display: block; }
        .audio-cinema { display: flex; align-items: center; justify-content: center; height: 100%; min-height: 240px; background: #111; }
        .audio-poster { max-height: 200px; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,.6); }

        /* Cinema mode */
        .cinema-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.88); z-index: 40; cursor: pointer; }
        .cinema-active { position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%,-50%) !important; width: min(92vw, 1280px) !important; z-index: 50; border-radius: 12px; }

        /* Controls */
        .cinema-controls { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px 14px; background: linear-gradient(transparent, rgba(0,0,0,.85)); transition: opacity .25s; }
        .cinema-controls.visible { opacity: 1; }
        .cinema-controls.hidden { opacity: 0; pointer-events: none; }
        .cinema-title { color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .progress-wrap { margin-bottom: 8px; }
        .progress-bar { width: 100%; height: 4px; accent-color: #4f98a3; cursor: pointer; }
        .controls-row { display: flex; align-items: center; justify-content: space-between; }
        .ctrl-left, .ctrl-right { display: flex; align-items: center; gap: 6px; }
        .ctrl-btn { background: none; border: none; color: #fff; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; align-items: center; opacity: .9; transition: opacity .15s; }
        .ctrl-btn:hover { opacity: 1; background: rgba(255,255,255,.1); }
        .ctrl-btn.active { color: #4f98a3; }
        .cinema-time { color: #ccc; font-size: 12px; margin-left: 4px; font-variant-numeric: tabular-nums; }

        /* Keyboard hint */
        .cinema-wrap:focus-within .cinema-controls { opacity: 1; }
      `}</style>
    </div>
  );
}
