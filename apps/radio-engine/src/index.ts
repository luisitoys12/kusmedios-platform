/**
 * KusMedios Radio Engine
 * Motor de radio propio: AutoDJ, playlists, scheduler, live takeover
 */

import express from 'express';
import { AutoDJManager } from './autodj/autodj-manager';
import { PlaylistManager } from './playlist/playlist-manager';
import { SchedulerManager } from './scheduler/scheduler-manager';
import { IcecastClient } from './icecast/icecast-client';
import { StatsCollector } from './stats/stats-collector';

const app = express();
app.use(express.json());

// Managers
const autoDJ = new AutoDJManager();
const playlists = new PlaylistManager();
const scheduler = new SchedulerManager();
const stats = new StatsCollector();

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// AutoDJ control
app.post('/autodj/:channelId/start', async (req, res) => {
  const { channelId } = req.params;
  await autoDJ.start(channelId);
  res.json({ success: true, channelId, status: 'started' });
});

app.post('/autodj/:channelId/stop', async (req, res) => {
  const { channelId } = req.params;
  await autoDJ.stop(channelId);
  res.json({ success: true, channelId, status: 'stopped' });
});

app.post('/autodj/:channelId/skip', async (req, res) => {
  const { channelId } = req.params;
  await autoDJ.skip(channelId);
  res.json({ success: true });
});

app.get('/autodj/:channelId/now-playing', (req, res) => {
  const { channelId } = req.params;
  res.json(autoDJ.getNowPlaying(channelId));
});

// Playlist management
app.get('/playlists/:channelId', async (req, res) => {
  const tracks = await playlists.getForChannel(req.params.channelId);
  res.json(tracks);
});

app.post('/playlists/:channelId/tracks', async (req, res) => {
  await playlists.addTrack(req.params.channelId, req.body);
  res.status(201).json({ success: true });
});

// Stats
app.get('/stats/:channelId', (req, res) => {
  res.json(stats.get(req.params.channelId));
});

const PORT = process.env.RADIO_ENGINE_PORT || 8000;
app.listen(PORT, () => {
  console.log(`🎵 KusMedios Radio Engine running on port ${PORT}`);
});
