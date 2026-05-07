/**
 * KusMedios Video Engine
 * Motor de video: RTMP ingest, HLS packaging, FFmpeg transcoding
 */

import express from 'express';
import { HLSPackager } from './hls/hls-packager';
import { FFmpegTranscoder } from './ffmpeg/ffmpeg-transcoder';
import { StreamKeyManager } from './stream-key/stream-key-manager';
import { StreamMonitor } from './monitor/stream-monitor';

const app = express();
app.use(express.json());

const hls = new HLSPackager();
const transcoder = new FFmpegTranscoder();
const streamKeys = new StreamKeyManager();
const monitor = new StreamMonitor();

// Health
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// RTMP webhook endpoints (called by Nginx RTMP module)
app.post('/webhooks/stream/start', async (req, res) => {
  const { name: streamKey } = req.body;
  const channel = await streamKeys.resolve(streamKey);
  if (!channel) return res.status(403).json({ error: 'Invalid stream key' });

  await hls.startPackaging(channel.id, streamKey);
  await monitor.markOnline(channel.id);
  console.log(`📹 Stream started: ${channel.name} (${streamKey})`);
  res.json({ success: true });
});

app.post('/webhooks/stream/stop', async (req, res) => {
  const { name: streamKey } = req.body;
  const channel = await streamKeys.resolve(streamKey);
  if (!channel) return res.sendStatus(404);

  await hls.stopPackaging(channel.id);
  await monitor.markOffline(channel.id);
  console.log(`📴 Stream stopped: ${channel.name}`);
  res.json({ success: true });
});

// Channel status
app.get('/channels/:channelId/status', (req, res) => {
  res.json(monitor.getStatus(req.params.channelId));
});

// HLS URL
app.get('/channels/:channelId/hls', (req, res) => {
  const url = hls.getPlaylistUrl(req.params.channelId);
  res.json({ url });
});

const PORT = process.env.VIDEO_ENGINE_PORT || 8001;
app.listen(PORT, () => {
  console.log(`📺 KusMedios Video Engine running on port ${PORT}`);
});
