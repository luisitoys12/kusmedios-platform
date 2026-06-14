'use client';
import { useState, useRef, useCallback } from 'react';

type MediaType = 'audio' | 'video';

interface UploadState {
  file: File | null;
  cover: File | null;
  previewUrl: string | null;
  coverUrl: string | null;
  progress: number;
  status: 'idle' | 'uploading' | 'done' | 'error';
  errorMsg: string | null;
}

const ACCEPTED: Record<MediaType, string> = {
  audio: 'audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/flac,audio/aac',
  video: 'video/mp4,video/webm,video/ogg,video/quicktime',
};

export function PodcastUploader() {
  const [mediaType, setMediaType] = useState<MediaType>('audio');
  const [drag, setDrag] = useState(false);
  const [meta, setMeta] = useState({ title: '', description: '', author: '' });
  const [upload, setUpload] = useState<UploadState>({
    file: null, cover: null, previewUrl: null, coverUrl: null,
    progress: 0, status: 'idle', errorMsg: null,
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setUpload(s => ({ ...s, file, previewUrl: url, status: 'idle', progress: 0 }));
  }, []);

  const handleCover = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setUpload(s => ({ ...s, cover: file, coverUrl: url }));
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const simulateUpload = useCallback(async () => {
    if (!upload.file || !meta.title) return;
    setUpload(s => ({ ...s, status: 'uploading', progress: 0 }));
    // Simulate XHR progress — replace with real fetch/XHR to your API
    for (let i = 5; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 80));
      setUpload(s => ({ ...s, progress: i }));
    }
    setUpload(s => ({ ...s, status: 'done' }));
  }, [upload.file, meta.title]);

  return (
    <div className="uploader">
      {/* Type toggle */}
      <div className="type-toggle">
        {(['audio', 'video'] as MediaType[]).map(t => (
          <button
            key={t}
            className={`type-btn ${ mediaType === t ? 'active' : '' }`}
            onClick={() => setMediaType(t)}
          >
            {t === 'audio'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 2l-4 5-4-5"/></svg>
            }
            {t === 'audio' ? 'Audio' : 'Video'}
          </button>
        ))}
      </div>

      <div className="uploader-grid">
        {/* Drop zone */}
        <div
          className={`dropzone ${ drag ? 'drag-over' : '' } ${ upload.file ? 'has-file' : '' }`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef} type="file" accept={ACCEPTED[mediaType]} hidden
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {upload.file ? (
            <div className="file-info">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f98a3" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span className="file-name">{upload.file.name}</span>
              <span className="file-size">{(upload.file.size / 1_048_576).toFixed(1)} MB</span>
            </div>
          ) : (
            <div className="drop-hint">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p>Arrastra tu {mediaType === 'audio' ? 'audio' : 'video'} aquí</p>
              <span>o haz clic para seleccionar</span>
            </div>
          )}
        </div>

        {/* Metadata form */}
        <div className="meta-form">
          <label className="field-label">Título *
            <input
              className="field-input" placeholder="Nombre del episodio / video"
              value={meta.title} onChange={e => setMeta(s => ({ ...s, title: e.target.value }))}
            />
          </label>
          <label className="field-label">Autor
            <input
              className="field-input" placeholder="Canal o presentador"
              value={meta.author} onChange={e => setMeta(s => ({ ...s, author: e.target.value }))}
            />
          </label>
          <label className="field-label">Descripción
            <textarea
              className="field-input" rows={3} placeholder="De qué trata este episodio..."
              value={meta.description}
              onChange={e => setMeta(s => ({ ...s, description: e.target.value }))}
            />
          </label>

          {/* Cover art */}
          <label className="field-label">Cover art
            <div
              className="cover-drop"
              onClick={() => coverRef.current?.click()}
            >
              <input ref={coverRef} type="file" accept="image/*" hidden
                onChange={e => { const f = e.target.files?.[0]; if (f) handleCover(f); }}
              />
              {upload.coverUrl
                ? <img src={upload.coverUrl} alt="cover" className="cover-preview" />
                : <span className="cover-hint">+ Imagen (JPG/PNG)</span>
              }
            </div>
          </label>
        </div>
      </div>

      {/* Progress */}
      {upload.status === 'uploading' && (
        <div className="progress-block">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${upload.progress}%` }} />
          </div>
          <span className="progress-pct">{upload.progress}%</span>
        </div>
      )}

      {upload.status === 'done' && (
        <p className="upload-success">✅ Subido correctamente</p>
      )}

      {/* Submit */}
      <button
        className="upload-btn"
        onClick={simulateUpload}
        disabled={!upload.file || !meta.title || upload.status === 'uploading'}
      >
        {upload.status === 'uploading' ? 'Subiendo...' : `Publicar ${mediaType === 'audio' ? 'Podcast' : 'Video'}`}
      </button>

      <style>{`
        .uploader { display: flex; flex-direction: column; gap: 20px; }
        .type-toggle { display: flex; gap: 8px; }
        .type-btn { display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 8px; border: 1px solid var(--color-border, #d4d1ca); background: var(--color-surface, #f9f8f5); color: var(--color-text, #28251d); font-size: 14px; cursor: pointer; transition: all .15s; }
        .type-btn.active { background: var(--color-primary, #01696f); color: #fff; border-color: var(--color-primary, #01696f); }
        .uploader-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 640px) { .uploader-grid { grid-template-columns: 1fr; } }
        .dropzone { border: 2px dashed var(--color-border, #d4d1ca); border-radius: 12px; min-height: 200px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color .15s, background .15s; }
        .dropzone:hover, .dropzone.drag-over { border-color: var(--color-primary, #01696f); background: color-mix(in oklch, var(--color-primary, #01696f) 6%, transparent); }
        .dropzone.has-file { border-style: solid; border-color: var(--color-primary, #01696f); }
        .drop-hint { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--color-text-muted, #7a7974); font-size: 14px; }
        .drop-hint p { font-weight: 500; color: var(--color-text, #28251d); }
        .drop-hint span { font-size: 12px; }
        .file-info { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px; }
        .file-name { font-size: 13px; font-weight: 500; text-align: center; word-break: break-all; }
        .file-size { font-size: 11px; color: var(--color-text-muted, #7a7974); }
        .meta-form { display: flex; flex-direction: column; gap: 14px; }
        .field-label { display: flex; flex-direction: column; gap: 5px; font-size: 13px; font-weight: 500; color: var(--color-text, #28251d); }
        .field-input { padding: 8px 12px; border-radius: 8px; border: 1px solid var(--color-border, #d4d1ca); background: var(--color-surface, #f9f8f5); font-size: 14px; resize: vertical; transition: border-color .15s; }
        .field-input:focus { outline: none; border-color: var(--color-primary, #01696f); }
        .cover-drop { width: 80px; height: 80px; border-radius: 8px; border: 1px dashed var(--color-border, #d4d1ca); display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; }
        .cover-preview { width: 100%; height: 100%; object-fit: cover; }
        .cover-hint { font-size: 11px; color: var(--color-text-muted, #7a7974); text-align: center; padding: 4px; }
        .progress-block { display: flex; align-items: center; gap: 10px; }
        .progress-track { flex: 1; height: 6px; background: var(--color-surface-offset, #f3f0ec); border-radius: 99px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--color-primary, #01696f); border-radius: 99px; transition: width .1s; }
        .progress-pct { font-size: 12px; font-variant-numeric: tabular-nums; color: var(--color-text-muted, #7a7974); min-width: 36px; text-align: right; }
        .upload-success { color: var(--color-success, #437a22); font-size: 14px; font-weight: 500; }
        .upload-btn { padding: 10px 24px; background: var(--color-primary, #01696f); color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background .15s; align-self: flex-start; }
        .upload-btn:hover:not(:disabled) { background: var(--color-primary-hover, #0c4e54); }
        .upload-btn:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
