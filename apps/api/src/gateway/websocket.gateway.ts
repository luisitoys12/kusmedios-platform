import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WSGateway({
  cors: { origin: '*' },
  namespace: '/realtime',
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('WebSocketGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe:channel')
  handleSubscribeChannel(client: Socket, channelId: string) {
    client.join(`channel:${channelId}`);
    this.logger.log(`Client ${client.id} subscribed to channel ${channelId}`);
  }

  // Emitir estado de canal en tiempo real
  emitChannelUpdate(channelId: string, data: any) {
    this.server.to(`channel:${channelId}`).emit('channel:update', data);
  }

  // Emitir now-playing
  emitNowPlaying(channelId: string, track: any) {
    this.server.to(`channel:${channelId}`).emit('now-playing', track);
  }

  // Emitir conteo de listeners
  emitListenerCount(channelId: string, count: number) {
    this.server.to(`channel:${channelId}`).emit('listeners', count);
  }
}
