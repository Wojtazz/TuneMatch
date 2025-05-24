import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SpotifyService } from './spotify/spotify.service';
import { SpotifyController } from './spotify/spotify.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SpotifyModule } from './spotify/spotify.module';
import { ScheduledTasksModule } from './scheduled-tasks/scheduled-tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb${configService.get<string>('DB_URL_MODIFIER') || ''}://${configService.get<string>('DB_USERNAME')}:${configService.get<string>('DB_PASSWORD')}@${configService.get<string>('DB_CLUSTER')}/?retryWrites=true&w=majority`,
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    SpotifyModule,
    ScheduledTasksModule,
  ],
  controllers: [AppController, SpotifyController],
  providers: [AppService, SpotifyService],
})
export class AppModule {}
