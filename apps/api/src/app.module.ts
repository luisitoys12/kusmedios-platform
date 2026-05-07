import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { RadioModule } from './radio/radio.module';
import { VideoModule } from './video/video.module';
import { BillingModule } from './billing/billing.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { StatsModule } from './stats/stats.module';
import { WebSocketGateway } from './gateway/websocket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AuthModule,
    UsersModule,
    TenantsModule,
    RadioModule,
    VideoModule,
    BillingModule,
    WebhooksModule,
    StatsModule,
  ],
  providers: [WebSocketGateway],
})
export class AppModule {}
