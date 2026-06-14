'use client';
import { useState, useRef, useCallback } from 'react';

export interface PlayerState {
  playing: boolean;
  muted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  cinema: boolean;
  fullscreen: boolean;
}

export function usePlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    playing: false,
    muted: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    cinema: false,
    fullscreen: false,
  });

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setState(s => ({ ...s, playing: true })); }
    else { v.pause(); setState(s => ({ ...s, playing: false })); }
  }, []);

  const seek = useCallback((seconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + seconds));
  }, []);

  const setVolume = useCallback((vol: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = Math.max(0, Math.min(1, vol));
    setState(s => ({ ...s, volume: v.volume, muted: v.volume === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setState(s => ({ ...s, muted: v.muted }));
  }, []);

  const toggleCinema = useCallback(() => {
    setState(s => ({ ...s, cinema: !s.cinema }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!document.fullscreenElement) {
      v.requestFullscreen();
      setState(s => ({ ...s, fullscreen: true }));
    } else {
      document.exitFullscreen();
      setState(s => ({ ...s, fullscreen: false }));
    }
  }, []);

  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setState(s => ({ ...s, currentTime: v.currentTime, duration: v.duration || 0 }));
  }, []);

  return { videoRef, state, toggle, seek, setVolume, toggleMute, toggleCinema, toggleFullscreen, onTimeUpdate };
}
